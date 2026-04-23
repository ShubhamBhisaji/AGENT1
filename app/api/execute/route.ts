import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, mkdir, readFile, readdir, stat } from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Simple in-memory rate limiting (DURGA MANDATE)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // 100 execute actions per minute

export const runtime = 'nodejs';

async function getDirectoryTree(dir: string, baseDir: string): Promise<any> {
  const name = path.basename(dir);
  const relativePath = path.relative(baseDir, dir);
  const stats = await stat(dir);

  if (stats.isDirectory()) {
    const children = await readdir(dir);
    const filteredChildren = children.filter(child => !['node_modules', '.git', '.next'].includes(child));
    const nodes = await Promise.all(
      filteredChildren.map(child => getDirectoryTree(path.join(dir, child), baseDir))
    );
    return {
      name,
      path: relativePath || '.',
      type: 'directory',
      children: nodes.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      })
    };
  }

  return {
    name,
    path: relativePath,
    type: 'file'
  };
}

export async function POST(request: NextRequest) {
  try {
    // Apply Rate Limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const rateLimitData = rateLimitMap.get(ip);

    if (rateLimitData && now - rateLimitData.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (rateLimitData.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { success: false, message: 'Execution rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      rateLimitData.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const body = await request.json();
    let { action, params } = body;

    // Alias 'shell' to 'runCommand' for AI robustness
    if (action === 'shell' || action === 'cmd') {
      action = 'runCommand';
    }

    const baseDir = path.join(process.cwd(), 'projects');

    // Safety check - ensure projects directory exists
    await mkdir(baseDir, { recursive: true });

    switch (action) {
      case 'listDir': {
        const tree = await buildTree(baseDir);
        return NextResponse.json({ success: true, tree });
      }

      case 'readFile': {
        const { filePath } = params;
        const fullPath = path.resolve(baseDir, filePath);

        // Basic security check: ensure path is within baseDir
        if (!fullPath.startsWith(baseDir)) {
           return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        // Check file size before reading (5MB limit)
        const fileStats = await stat(fullPath);
        if (fileStats.size > 5 * 1024 * 1024) {
          return NextResponse.json({
            success: false,
            message: `File too large (${Math.round(fileStats.size / 1024 / 1024)}MB). Maximum 5MB allowed. Use terminal to view large files.`
          }, { status: 413 });
        }

        const content = await readFile(fullPath, 'utf8');
        return NextResponse.json({ success: true, content });
      }

      case 'writeFile': {
        const { filePath, content } = params;
        const fullPath = path.resolve(baseDir, filePath);

        if (!fullPath.startsWith(baseDir)) {
           return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        // Ensure directory exists
        await mkdir(path.dirname(fullPath), { recursive: true });
        await writeFile(fullPath, content, 'utf8');

        return NextResponse.json({
          success: true,
          message: `File created: ${filePath}`
        });
      }

      case 'runCommand': {
        const { command } = params;

        // Basic security: avoid common destructive commands in this simple MVP
        if (command.includes('rm -rf /') || command.includes('del /s')) {
          return NextResponse.json({
            success: false,
            message: 'Forbidden command detected.'
          }, { status: 403 });
        }

        try {
          const { stdout, stderr } = await execAsync(command, {
            cwd: baseDir,
            timeout: 30000,  // 30 second timeout
            maxBuffer: 1024 * 1024 * 5  // 5MB output limit
          });

          return NextResponse.json({
            success: true,
            stdout,
            stderr,
            message: 'Command executed successfully'
          });
        } catch (error: any) {
          if (error.killed || error.signal === 'SIGTERM') {
            return NextResponse.json({
              success: false,
              message: 'Command timeout - execution took longer than 30 seconds',
              stdout: error.stdout || '',
              stderr: error.stderr || ''
            }, { status: 408 });
          }
          throw error;
        }
      }

      default:
        return NextResponse.json(
          { success: false, message: `Unknown action: ${action}. Available actions are runCommand, readFile, writeFile, listDir.` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Execution error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Execution failed'
    }, { status: 500 });
  }
}

async function buildTree(dir: string): Promise<any> {
  const name = path.basename(dir);
  const relativePath = path.relative(process.cwd(), dir);
  const stats = await stat(dir);

  if (stats.isDirectory()) {
    const children = await readdir(dir);
    const filteredChildren = children.filter(child => !['node_modules', '.git', '.next'].includes(child));
    const nodes = await Promise.all(
      filteredChildren.map(child => getDirectoryTree(path.join(dir, child), dir))
    );
    return {
      name,
      path: relativePath || '.',
      type: 'directory',
      children: nodes.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      })
    };
  }

  return {
    name,
    path: relativePath,
    type: 'file'
  };
}
