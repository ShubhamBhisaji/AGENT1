⚡ DEV-AI AGENT INVOCATION GUIDE
================================

# How to Use DEV-AI Agents for Devi AI Development

This guide explains how to invoke specific agents to continue development, fix bugs, or add features.

---

## 🎯 AGENT INVOCATION PATTERNS

### Pattern 1: Feature Implementation

**When:** You want to add a new feature

**Invoke:**
```
⚡ DEV-AI › MANDALA III › VISHWAKARMA

Mantra: "Act as VISHWAKARMA (Lead Engineer). Implement [FEATURE_NAME]."

Task Breakdown:
1. BRAHMA → Design architecture for feature
2. SARASWATI → Define design tokens needed
3. VISHWAKARMA → Build React components
4. INDRA → Integrate any new APIs
5. TVAK → Style with Tailwind CSS
6. HANUMAN → Write tests
7. DURGA → Security review
8. NANDI → Approve for merge
```

---

### Pattern 2: Bug Fix

**When:** A bug is reported

**Invoke:**
```
⚡ DEV-AI › MANDALA IV › KARTIKEYA

Mantra: "Act as KARTIKEYA (Strategy Lead). Debug and fix [BUG_NAME]."

Task Breakdown:
1. KARTIKEYA → Analyze the issue
2. YAMA → Review error handling
3. SKANDA → Check logic
4. HANUMAN → Write test for bug
5. NANDI → Code review
```

---

### Pattern 3: Performance Optimization

**When:** App is slow or has memory issues

**Invoke:**
```
⚡ DEV-AI › MANDALA II › VAYU & MANDALA III › SHIVA

Mantra: "Act as VAYU & SHIVA. Optimize performance for [SPECIFIC_AREA]."

Task Breakdown:
1. VAYU → Identify UI performance bottlenecks
2. SHIVA → Refactor code for efficiency
3. AGNI → Check build optimization
4. HANUMAN → Performance testing
5. CHITRAGUPTA → Document improvements
```

---

### Pattern 4: Security Hardening

**When:** Security audit needed or vulnerability found

**Invoke:**
```
⚡ DEV-AI › MANDALA IV › DURGA

Mantra: "Act as DURGA (The Shield). Conduct security hardening for [SCOPE]."

Task Breakdown:
1. DURGA → Identify vulnerabilities
2. INDRA → Review API security
3. BHAIRAVA → Check access control
4. KARTIKEYA → Code review for security
5. CHITRAGUPTA → Document security changes
```

---

### Pattern 5: Documentation Update

**When:** Docs need to be updated or new guide needed

**Invoke:**
```
⚡ DEV-AI › MANDALA V › DHANVANTARI

Mantra: "Act as DHANVANTARI (Health & Docs). Update documentation for [TOPIC]."

Task Breakdown:
1. DHANVANTARI → Create/update docs
2. BRIHASPATI → Validate technical accuracy
3. SHUKRA → Review UX clarity
4. NARADA → Coordinate with relevant agents
```

---

### Pattern 6: Adding Persistence (Database)

**When:** Ready to add chat history & user accounts

**Invoke:**
```
⚡ DEV-AI › MANDALA III › KUBERA & MANDALA I › VISHNU

Mantra: "Act as KUBERA & VISHNU. Design persistence layer for [DATA_TYPE]."

Task Breakdown:
1. BRAHMA → Design database schema
2. VISHNU → State management strategy
3. KUBERA → Storage implementation
4. INDRA → API endpoint for storage
5. DURGA → Security for stored data
6. HANUMAN → Test persistence
7. ADITI → Scalability review
```

---

### Pattern 7: Deployment

**When:** Ready to deploy to production

**Invoke:**
```
⚡ DEV-AI › MANDALA IV › NANDI

Mantra: "Act as NANDI (Gatekeeper). Approve and gate deployment."

Pre-Deployment Checklist:
1. [x] KARTIKEYA → Code review complete
2. [x] DURGA → Security audit passed
3. [x] HANUMAN → Tests passing
4. [x] VAYU → Performance verified
5. [x] DHANVANTARI → Documentation updated
6. [x] ADITI → Scalability plan ready
7. ✅ NANDI → Approve deployment

Command:
> npm run build
> npm start  (production server)
```

---

## 🔧 COMMON DEVELOPMENT TASKS

### Task: Add Multi-Model Support

**Agents Needed:** BRAHMA, VISHWAKARMA, INDRA, TVAK

```
Step 1: BRAHMA designs architecture
  - UI for model selection
  - API routing for different models

Step 2: INDRA integrates new APIs
  - Claude API
  - Anthropic SDK
  - Handle API key routing

Step 3: VISHWAKARMA builds UI
  - Model selector dropdown
  - Response differences handling

Step 4: TVAK styles components
  - Tailwind for new UI elements
```

---

### Task: Add User Authentication

**Agents Needed:** BRAHMA, DURGA, BHAIRAVA, INDRA, VISHNU, HANUMAN

```
Step 1: BRAHMA designs auth flow
  - Login/signup pages
  - Session management

Step 2: DURGA handles security
  - JWT implementation
  - Password hashing
  - CORS for auth endpoints

Step 3: BHAIRAVA manages access
  - Protected routes
  - Role-based access

Step 4: INDRA integrates provider
  - Auth API endpoint
  - Token management

Step 5: VISHNU handles state
  - Auth state in React
  - Session persistence

Step 6: HANUMAN tests auth
  - Login flow tests
  - Token refresh tests
  - Session timeout tests
```

---

### Task: Export Chat as PDF

**Agents Needed:** BRAHMA, SKANDA, INDRA, DHANVANTARI

```
Step 1: BRAHMA designs feature
  - PDF structure
  - Metadata (date, title)

Step 2: SKANDA handles logic
  - Format messages for PDF
  - Generate timestamps

Step 3: INDRA integrates library
  - pdfkit or similar
  - API endpoint for PDF generation

Step 4: DHANVANTARI documents
  - How to use export feature
  - API documentation
```

---

### Task: Add Dark/Light Theme Toggle

**Agents Needed:** CHANDRA, TVAK, VISHNU, VAYU

```
Step 1: CHANDRA designs both themes
  - Light color palette
  - Dark color palette (already done)

Step 2: TVAK implements in Tailwind
  - Create light theme variant
  - Toggle mechanism

Step 3: VISHNU manages theme state
  - React context or local storage
  - Persistence across sessions

Step 4: VAYU optimizes performance
  - Minimize repaints
  - CSS transitions smooth
```

---

## 🚀 AGENT CHAIN SHORTCUTS

**For speed, use pre-defined chains:**

### Quick Bug Fix Chain
```
KARTIKEYA → YAMA → HANUMAN → NANDI
(Identify → Handle → Test → Gate)
```

### Quick Feature Chain
```
BRAHMA → VISHWAKARMA → TVAK → HANUMAN → NANDI
(Design → Build → Style → Test → Gate)
```

### Quick Optimization Chain
```
VAYU → SHIVA → AGNI → HANUMAN
(Profile → Refactor → Rebuild → Test)
```

### Quick Security Chain
```
DURGA → KARTIKEYA → NANDI
(Harden → Review → Approve)
```

---

## 📝 AGENT REQUEST TEMPLATE

Use this template when requesting agent work:

```markdown
⚡ DEV-AI › [MANDALA] › [AGENT]

**Objective:** [What you want done]

**Context:**
- Feature/Bug/Task: [Name]
- Priority: [HIGH/MEDIUM/LOW]
- Scope: [What's in scope]
- Constraints: [Time, resources, dependencies]

**Success Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Supporting Agents:**
- [AGENT1] for [reason]
- [AGENT2] for [reason]

**Expected Output:**
- File changes: [What files]
- Tests: [What to test]
- Documentation: [What to document]
```

---

## 🎯 AGENT SPECIALTIES QUICK REFERENCE

| Need | Agent(s) | Mantra |
|------|----------|--------|
| **Design system** | SARASWATI | "Define aesthetic tokens" |
| **Component build** | VISHWAKARMA | "Build from architecture" |
| **API integration** | INDRA | "Connect to services" |
| **Styling** | TVAK | "Implement with Tailwind" |
| **Performance** | VAYU, SHIVA | "Light & fast" |
| **Security** | DURGA | "Protect & verify" |
| **Testing** | HANUMAN | "Verify quality" |
| **Documentation** | DHANVANTARI | "Clear & complete" |
| **Scalability** | ADITI | "Plan for growth" |
| **Error handling** | YAMA | "Graceful failures" |
| **Architecture** | BRAHMA | "Design systems" |
| **Code review** | KARTIKEYA | "Validate logic" |
| **Deployment** | NANDI | "Gate to production" |

---

## 🔄 AGENT WORKFLOW EXAMPLES

### Example 1: Add Chat Export Feature

```
REQUEST:
⚡ DEV-AI › MANDALA III › BRAHMA
"Design chat export feature with PDF and JSON formats"

WORKFLOW:
1. BRAHMA designs export architecture
   └─ PDF format spec
   └─ JSON format spec
   └─ UI placement

2. SKANDA implements export logic
   └─ Message formatting
   └─ Timestamp handling

3. INDRA integrates PDF library
   └─ pdfkit setup
   └─ API endpoint

4. TVAK styles export UI
   └─ Export button design
   └─ Format selector

5. DHANVANTARI documents feature
   └─ User guide
   └─ API reference

6. HANUMAN writes tests
   └─ Export logic tests
   └─ UI tests

7. NANDI gates for merge
   └─ Code review
   └─ Approval

COMPLETE ✅
```

---

### Example 2: Fix API Error Bug

```
REQUEST:
⚡ DEV-AI › MANDALA IV › KARTIKEYA
"Fix bug: 'API key not found' error when key exists in .env.local"

WORKFLOW:
1. KARTIKEYA analyzes bug
   └─ Reproduces issue
   └─ Finds root cause

2. YAMA reviews error handling
   └─ Check error path
   └─ Improve error messages

3. INDRA checks API integration
   └─ Verify env var loading
   └─ Check header configuration

4. HANUMAN writes regression test
   └─ Test with missing key
   └─ Test with valid key

5. NANDI approves fix
   └─ Code review
   └─ Merge to main

COMPLETE ✅
```

---

## 📊 AGENT AVAILABILITY

All 30 agents are **always available**:

```
Active Agents: 30/30
Status: Ready to receive mantra and constraints
Response Time: Immediate
Coordination: Via NARADA
```

---

## 🎊 WHEN ALL AGENTS WORK TOGETHER

When you invoke the full orchestra:

```
⚡ DEV-AI › SAMUDRA MANTHAN (The Great Churning)

All 30 agents activate:
- TRIMURTI provides vision
- SARASWATI MANDALA creates beauty
- VISHWAKARMA MANDALA builds substance
- HANUMAN MANDALA tests & secures
- RISHI MANDALA coordinates & documents

Result: Complete feature or product ready for production
Effort: Compressed timeline, maximum quality, zero defects
```

---

## ✅ CHECKLIST FOR SUCCESSFUL AGENT INVOCATION

When invoking agents:

- [ ] Clear objective stated
- [ ] Scope well-defined
- [ ] Success criteria listed
- [ ] Supporting agents identified
- [ ] Expected output described
- [ ] No ambiguities or open questions

**Agent will proceed with autonomous authority when checklist complete.**

---

## 🚀 NEXT DEVELOPMENT PRIORITIES

Based on ADITI's scalability review:

**Phase 2 (v1.1):** Persistence Layer
- Assign to: KUBERA, VISHNU, INDRA, DURGA
- Timeline: Next sprint
- Effort: High

**Phase 3 (v1.2):** User Authentication
- Assign to: DURGA, BHAIRAVA, INDRA, HANUMAN
- Timeline: Following sprint
- Effort: High

**Phase 4 (v1.3):** Multi-Model Support
- Assign to: BRAHMA, INDRA, VISHWAKARMA
- Timeline: Future sprint
- Effort: Medium

**Phase 5 (v2.0):** Advanced Features
- Chat search, sharing, export, voice input
- Assign to: Full orchestra
- Timeline: Roadmap
- Effort: Epic

---

## 📞 HOW TO GET HELP

**Still confused about agents?**

1. Review [AGENTS.md](./AGENTS.md) for agent responsibilities
2. Review this file for invocation patterns
3. Use the template above to make clear requests
4. Agents will handle the rest autonomously

**All 30 agents stand ready.** 🙏

---

**Created by:** NARADA (The Communicator)
**Date:** April 22, 2026
**Version:** 1.0.0

*Invoke agents with clarity. Command them with confidence. Results will follow.*
