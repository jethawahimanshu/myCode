# Workflow Examples

This document provides detailed workflow examples for using the SonarLint MCP Server with GitHub Copilot in IntelliJ IDEA.

## Table of Contents

1. [Daily Code Quality Check](#daily-code-quality-check)
2. [Pre-Commit Cleanup](#pre-commit-cleanup)
3. [New Feature Development](#new-feature-development)
4. [Code Review Preparation](#code-review-preparation)
5. [Legacy Code Refactoring](#legacy-code-refactoring)
6. [Learning Best Practices](#learning-best-practices)

---

## Daily Code Quality Check

**Scenario**: Start your day by checking and fixing code quality issues.

### Steps:

1. Open your project in IntelliJ IDEA
2. Open GitHub Copilot Chat
3. Run the following command:

```
@workspace Use the sonar-copilot MCP server to give me a summary of all SonarLint issues in my project
```

4. Copilot will respond with a breakdown by severity
5. Follow up with:

```
Show me all BLOCKER issues and help me fix them
```

6. Copilot Agent Mode will:
   - List all blocker issues
   - Explain each issue
   - Suggest fixes
   - Apply fixes (with your confirmation)

### Expected Output:

```json
{
  "totalIssues": 47,
  "bySeverity": {
    "BLOCKER": 2,
    "CRITICAL": 5,
    "MAJOR": 15,
    "MINOR": 20,
    "INFO": 5
  },
  "priorityRecommendation": "Fix BLOCKER issues first"
}
```

---

## Pre-Commit Cleanup

**Scenario**: Clean up code quality issues before committing changes.

### Steps:

1. Stage your changes in Git
2. Open Copilot Chat and run:

```
@workspace I'm about to commit my changes. Use the sonar-copilot MCP server to check for any SonarLint issues in my staged files and fix them.
```

3. Copilot will:
   - Identify modified files
   - Check for Sonar issues in those files
   - Fix issues automatically
   - Show you the changes

4. Review the fixes and commit

### Pro Tip:

Create an IntelliJ run configuration that triggers this workflow:

1. **Run** → **Edit Configurations**
2. Add new **Shell Script** configuration
3. Script content:

```bash
#!/bin/bash
echo "Checking for SonarLint issues in staged files..."
# This will trigger a notification to check Copilot
```

---

## New Feature Development

**Scenario**: You're developing a new feature and want to maintain code quality.

### Steps:

1. After writing your initial implementation, run:

```
@workspace I just implemented a new feature in src/main/java/com/example/FeatureX.java.
Use the sonar-copilot MCP server to check for any code quality issues and fix them.
```

2. Copilot will:
   - Analyze the file for Sonar issues
   - Explain each issue in the context of your feature
   - Suggest fixes that maintain your implementation logic
   - Apply fixes

3. Follow up with:

```
Are there any performance or security issues I should address?
```

4. Copilot will check for CRITICAL and BLOCKER issues specifically

---

## Code Review Preparation

**Scenario**: Prepare your code for peer review by addressing code quality issues.

### Steps:

1. Before creating a PR, run:

```
@workspace Use the sonar-copilot MCP server to perform a comprehensive code quality check
on all files I've modified in the last 3 days. Generate a report and fix all issues.
```

2. Copilot Agent Mode will:
   - Identify recently modified files
   - Run Sonar analysis
   - Create a summary report
   - Fix issues systematically

3. For specific severity levels:

```
Focus on CRITICAL and MAJOR issues first, then we'll handle MINOR issues
```

4. Generate a summary for your PR description:

```
Create a summary of the code quality improvements I made,
including the number of issues fixed by severity
```

---

## Legacy Code Refactoring

**Scenario**: You're refactoring old code with many Sonar issues.

### Steps:

1. Start with a baseline:

```
@workspace Use the sonar-copilot MCP server to analyze
src/main/java/com/example/legacy/OldService.java and show me all issues grouped by type
```

2. Prioritize by impact:

```
Show me all BUG and VULNERABILITY type issues first
```

3. Fix issues incrementally:

```
Let's fix these issues one by one. Start with the most severe.
For each fix:
1. Explain the issue
2. Show me the current code
3. Explain your proposed fix
4. Apply the fix

Wait for my confirmation before moving to the next issue.
```

4. Track progress:

```
How many issues are left? Show me the updated summary.
```

### Example Session:

```
User: Use sonar-copilot to analyze OldService.java

Copilot: I found 23 issues:
- 2 BUG type issues (CRITICAL)
- 1 VULNERABILITY (BLOCKER)
- 15 CODE_SMELL (MAJOR/MINOR)
- 5 INFO issues

User: Fix the BLOCKER vulnerability first

Copilot: Issue: SQL Injection vulnerability (java:S3649)
Location: Line 145
Current code:
  String query = "SELECT * FROM users WHERE id=" + userId;

This is vulnerable because user input is concatenated directly.
Fix: Use PreparedStatement
  String query = "SELECT * FROM users WHERE id=?";
  PreparedStatement stmt = conn.prepareStatement(query);
  stmt.setString(1, userId);

Shall I apply this fix? [Yes/No]

User: Yes

Copilot: Fix applied. 1 BLOCKER resolved. 22 issues remaining.
```

---

## Learning Best Practices

**Scenario**: Learn about Sonar rules and best practices while coding.

### Steps:

1. When you encounter an issue, ask for details:

```
@workspace I see a Sonar issue "java:S1234" in my code.
Use the sonar-copilot MCP server to explain this rule and show me examples
of both the problem and the solution.
```

2. Copilot will:
   - Fetch the rule description
   - Explain why it matters
   - Show examples from your codebase
   - Demonstrate the fix

3. Learn about patterns:

```
Show me all occurrences of this rule in my project so I can understand the pattern
```

4. Get comprehensive explanations:

```
For each occurrence of java:S1234, explain:
- Why this is a problem
- What the best practice is
- How to fix it in this specific context
```

---

## Advanced Workflows

### Bulk Fix by Rule Type

```
@workspace Use sonar-copilot to:
1. Find all occurrences of rule java:S1234
2. Show me the first 3 examples
3. If the fix is straightforward, apply it to all occurrences
4. If the fix needs context, ask me for each one
```

### Custom Severity Thresholds

```
@workspace I want to maintain zero BLOCKER and CRITICAL issues.
Use sonar-copilot to:
1. Check current status
2. If any exist, create a fixing plan
3. Fix them all
4. Verify the result
```

### Integration with CI/CD

```
@workspace Generate a report of all SonarLint issues in JSON format
that I can use in my CI/CD pipeline. Include:
- Total count
- Breakdown by severity
- Breakdown by type (BUG, VULNERABILITY, CODE_SMELL)
- List of affected files
```

---

## Tips for Effective Use

### 1. Be Specific About Scope

Instead of:
```
Fix all issues
```

Use:
```
Fix all CRITICAL severity issues in the authentication module (src/auth/)
```

### 2. Request Explanations

```
Before fixing, explain why this is an issue and what the fix does
```

### 3. Batch Similar Issues

```
Find all issues related to null pointer safety and fix them in one session
```

### 4. Use Agent Mode for Complex Tasks

```
@workspace /agent Start a session to systematically fix all code quality issues.
Work through them by severity, starting with BLOCKER.
```

### 5. Verify Fixes

```
After fixing these issues, run the analysis again and confirm they're resolved
```

---

## Troubleshooting Workflows

### Issue: Copilot Can't Access MCP Server

**Check:**
```
@workspace What MCP servers are available?
```

**If server not listed:**
1. Verify `mcp.json` configuration
2. Restart IntelliJ
3. Check MCP server logs

### Issue: No Issues Found

**Verify SonarLint is working:**
1. Run **Analyze** → **Analyze with SonarLint** in IntelliJ
2. Check if issues appear in SonarLint tool window
3. Then ask Copilot again

### Issue: Wrong Context

**Be explicit:**
```
@workspace Use the sonar-copilot MCP server to get issues specifically from
/absolute/path/to/MyFile.java, not the whole project
```

---

## Integration with IntelliJ Features

### 1. Combine with Quick Documentation

```
@workspace Show me the Sonar issue at line 145 in MyClass.java,
and also show me the IntelliJ quick documentation for the method
```

### 2. Refactoring Integration

```
@workspace I'm about to refactor this class. First, fix all Sonar issues,
then suggest refactoring opportunities
```

### 3. Testing Integration

```
@workspace After fixing these Sonar issues, help me write tests
to ensure the fixes work correctly
```

---

## Best Practices

1. **Regular Checks**: Run daily summaries to stay on top of issues
2. **Pre-Commit**: Always check before committing
3. **Context First**: Understand issues before fixing
4. **Incremental Fixes**: Don't try to fix everything at once
5. **Learn Patterns**: Use issues as learning opportunities
6. **Verify Changes**: Always review AI-suggested fixes
7. **Team Consistency**: Share workflows with your team

---

## Example Full Session

```
[Morning - Daily Quality Check]
User: @workspace Good morning! Use sonar-copilot to show my code quality status

Copilot: Good morning! Here's your code quality status:
- Total issues: 34
- BLOCKER: 0 ✅
- CRITICAL: 1 ⚠️
- MAJOR: 8
- MINOR: 20
- INFO: 5

You have 1 CRITICAL issue. Would you like me to fix it?

User: Yes, show me the critical issue first

Copilot: [Shows issue details with context]
Issue: Potential null pointer dereference (java:S2259)
File: UserService.java:67
... [context code] ...
This could cause a NullPointerException. I can add a null check.

User: Go ahead and fix it

Copilot: [Applies fix]
Fixed! Added null check. CRITICAL issues: 0 ✅

User: Great! Now let's tackle the 8 MAJOR issues

Copilot: [Proceeds with agent mode to fix MAJOR issues]
```

---

**Ready to maintain excellent code quality!** 🎯
