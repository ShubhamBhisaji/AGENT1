import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Simple in-memory rate limiting (DURGA MANDATE)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 50; // 50 requests per minute

export async function POST(request: NextRequest) {
  try {
    // Apply Rate Limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const rateLimitData = rateLimitMap.get(ip);

    if (rateLimitData && now - rateLimitData.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (rateLimitData.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      rateLimitData.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GOOGLE_API_KEY environment variable is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { fullHistory, prompt } = body;

    // Validate input
    if (!fullHistory || !Array.isArray(fullHistory)) {
      return NextResponse.json(
        { error: 'fullHistory parameter is required and must be an array' },
        { status: 400 }
      );
    }

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'prompt parameter is required' },
        { status: 400 }
      );
    }

    // Enhanced System Instruction for Devi AI Studio God-Mode (Ultra-Autonomous Action)
    const systemPrompt = `You are Devi AI. Your goal is ACTION. Minimize chatter.

LOOP PROTOCOL:
1. Identify Agent: [[AGENT:NAME]]
2. Perform Action: Use exactly ONE of the available actions below per response.
3. Wait for [[OBSERVATION]]
4. Repeat until task is 100% complete.

AVAILABLE ACTIONS (MUST BE VALID JSON):
- [[ACTION:runCommand|{"command": "your_command_here"}]]
- [[ACTION:readFile|{"filePath": "path/to/file"}]]
- [[ACTION:writeFile|{"filePath": "path/to/file", "content": "file_content"}]]
- [[ACTION:listDir|{}]]

STRICT RULES:
- Never use markdown blocks (\`\`\`) inside the ACTION JSON.
- If a task requires multiple steps (e.g. build a landing page), DO NOT wait for the user.
- Use the [[OBSERVATION]] to move to the next file or command immediately.
- Only provide a short status update (1 sentence max) per loop.
- Focus on the "projects" sandbox on Windows ('dir', 'type', etc.).

GOAL: Complete requested project fully with zero manual steps from user.`;

    // Helper function to prune message history to prevent token overflow
    const pruneHistory = (messages: any[], maxMessages = 25) => {
      if (messages.length <= maxMessages) return messages;

      // Keep oldest 5 messages for context, skip a divider message, then keep newest 20
      return [
        ...messages.slice(0, 5),  // Oldest 5 for context
        {
          role: 'user',
          parts: [{ text: '[... conversation history truncated ...]' }]
        },
        ...messages.slice(-20)     // Newest 20 messages
      ];
    };

    // Convert messages to Gemini format and prune history
    const chatHistory = pruneHistory(
      fullHistory
        .filter((m: any) => m && m.content && !m.hidden)  // Filter out invalid and hidden messages
        .map((m: any) => ({
          role: m.role === 'user' || m.role === 'system' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
    );

    // Call Gemini API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: chatHistory,
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.3,  // Slightly higher for more variety in responses
            topP: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json(
        { error: `Gemini API error: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from Gemini response
    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response generated';

    return NextResponse.json({
      success: true,
      message: aiResponse,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process your request',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
