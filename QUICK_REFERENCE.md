# 🎯 QUICK FIX REFERENCE GUIDE
**Status:** 25 Issues Found | 7 Critical | 8 High | 6 Medium | 4 Low

---

## 🔴 CRITICAL ISSUES AT A GLANCE

### Issue #1: Type Mismatch (Message.role)
```diff
// types/index.ts
- role: 'user' | 'assistant';
+ role: 'user' | 'assistant' | 'system';
```
**Where it breaks:** Line 42 in page.tsx tries `role: 'system'` → TypeScript error

---

### Issue #2: Autonomous Loop Stops
**Symptom:** AI responds once, then nothing  
**Root cause:** Observation messages have wrong role, fullHistory parameter inconsistent  
**Locations:** page.tsx lines 275-295, 295-302, chat/route.ts line 40  
**Fix complexity:** 4 hours

---

### Issue #3: No Command Timeout
```diff
// execute/route.ts line 103
- const { stdout, stderr } = await execAsync(command, { cwd: baseDir });
+ const { stdout, stderr } = await execAsync(command, { 
+   cwd: baseDir,
+   timeout: 30000,  // 30 seconds
+   maxBuffer: 1024 * 1024 * 5  // 5MB
+ });
```
**Impact:** `npm install` could hang forever → UI freezes

---

### Issue #4: No File Size Limit
```diff
// execute/route.ts line 69
+ const stats = await stat(fullPath);
+ if (stats.size > 5 * 1024 * 1024) {
+   return NextResponse.json(
+     { success: false, message: 'File too large (max 5MB)' },
+     { status: 413 }
+   );
+ }
const content = await readFile(fullPath, 'utf8');
```
**Impact:** Opening 500MB file → server OOM crash

---

### Issue #5: activeFileIndex Race Condition
```diff
// page.tsx line 201 (closeFile function)
- setActiveFileIndex(newFiles.length - 1);
+ setActiveFileIndex(newFiles.length > 0 ? newFiles.length - 1 : -1);
```
**Impact:** Closing last file → crash when accessing array[-1]

---

## 🟠 HIGH PRIORITY QUICK FIXES

### Issue #6: Editor Not Saving
```typescript
// page.tsx line 700-715 - ADD THIS:
<Editor
  value={openFiles[activeFileIndex].content}
  onChange={(value) => {
    setOpenFiles(prev => prev.map((f, i) =>
      i === activeFileIndex ? { ...f, content: value || '' } : f
    ));
  }}
/>
```

---

### Issue #7: No Iteration Counter
```typescript
// page.tsx - ADD STATE:
const [iterationCount, setIterationCount] = useState(0);

// In processActions (line 285):
if (actionResults.length > 0 && iterationCount < 10) {
  setIterationCount(iterationCount + 1);
  // ... trigger next
} else if (iterationCount >= 10) {
  addTerminalLog("⚠️ Max iterations reached");
  setIterationCount(0);
}
```

---

### Issue #8: fullHistory Parameter Confusion
```diff
// page.tsx line 295-302 - REMOVE messages parameter
body: JSON.stringify({
  prompt: messageContent,
- messages: updatedMessages.filter(m => !m.hidden),
  fullHistory: updatedMessages  // ✅ Use only this
}),

// chat/route.ts - ADD VALIDATION
if (!body.fullHistory) {
  return NextResponse.json(
    { error: 'fullHistory parameter required' },
    { status: 400 }
  );
}
```

---

### Issue #9: Browser Preview Port Hardcoded
```typescript
// page.tsx line 327-330 - IMPLEMENT PORT SCANNING
const findAvailablePort = async (startPort = 3001) => {
  for (let port = startPort; port < startPort + 10; port++) {
    try {
      const response = await fetch(`http://localhost:${port}/`, {
        signal: AbortSignal.timeout(100)
      });
    } catch {
      return port;  // Available!
    }
  }
  return startPort;
};

const port = await findAvailablePort();
setPreviewUrl(`http://localhost:${port}`);
```

---

### Issue #10: Context Window Overflow
```typescript
// chat/route.ts - ADD BEFORE sending to Gemini
const pruneHistory = (messages: any[], maxMessages = 25) => {
  if (messages.length <= maxMessages) return messages;
  return [
    ...messages.slice(0, 5),  // Keep oldest 5
    { role: 'user', parts: [{ text: '...(history truncated)...' }] },
    ...messages.slice(-20)     // Keep last 20
  ];
};

const chatHistory = pruneHistory(fullHistory || []);
```

---

## 🟡 MEDIUM ISSUES QUICK REFERENCE

| Issue | File | Line | Quick Fix |
|-------|------|------|-----------|
| Unused RequestBody type | chat/route.ts | 8 | Delete interface |
| Error state not displayed | page.tsx | 52, 617 | Add toast notification |
| Temperature too low | chat/route.ts | 59 | Change 0.2 → 0.3 |
| System prompt inefficient | chat/route.ts | 16-50 | Use systemInstruction param |
| Race condition in effects | page.tsx | 86-97 | Simplify dependencies |

---

## ✅ VALIDATION COMMANDS

### Test each fix:
```bash
# 1. Check TypeScript compilation
npm run build

# 2. Test chat message sending
# Look for: Chat responds consistently

# 3. Test autonomous loop
# Ask: "Create a file called test.txt with content 'hello'"
# Look for: File appears in explorer, then terminal shows completion

# 4. Test command timeout
# Ask: "Run: ping 127.0.0.1"
# Look for: Command completes or timeout message after 30 sec

# 5. Test file size limit
# Create a large file (>5MB) in projects folder
# Try to open in editor
# Look for: "File too large" error message

# 6. Test editor saving
# Open a file, edit it, switch tabs, switch back
# Look for: Changes persist

# 7. Test port conflict
# Run project twice
# Look for: Second project gets 3002 port

# 8. Test context window
# Send 100+ chat messages
# Look for: App doesn't crash, handles gracefully
```

---

## 🚀 IMPLEMENTATION ROADMAP

**Week 1 (Critical Fixes):**
- Day 1: Fix types, add timeouts & file limits, fix race conditions
- Day 2: Fix iteration counter & autonomous loop logic
- Day 3: Testing & validation

**Week 2 (High Priority):**
- Day 1: Fix editor saving, browser preview, port detection
- Day 2: Fix fullHistory parameter flow completely
- Day 3: Testing & edge case handling

**Week 3 (Medium Priority):**
- Day 1: Add error UI, optimize system prompt
- Day 2: Context pruning, cleanup linting
- Day 3: Final testing & optimization

---

**Next Action:** Open AUDIT_REPORT.md for detailed explanation of each issue
