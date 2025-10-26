# Quick Start Guide

Get up and running with SonarLint MCP Server in 5 minutes!

## Step 1: Install (2 minutes)

```bash
cd sonar-copilot-mcp
npm install
npm run build
```

## Step 2: Configure IntelliJ (2 minutes)

1. Open IntelliJ IDEA
2. Click **GitHub Copilot** icon (bottom right status bar)
3. Select **Edit Settings**
4. Find **MCP Servers** section
5. Add this configuration (replace the path):

```json
{
  "mcpServers": {
    "sonar-copilot": {
      "command": "node",
      "args": [
        "/Users/yourname/path/to/sonar-copilot-mcp/dist/index.js"
      ],
      "env": {
        "WORKSPACE_PATH": "${workspaceFolder}"
      }
    }
  }
}
```

6. Save and restart IntelliJ

## Step 3: Verify (30 seconds)

1. Open GitHub Copilot Chat
2. Type: `@workspace What MCP servers are available?`
3. You should see `sonar-copilot` listed ✅

## Step 4: First Use (30 seconds)

Try this command in Copilot Chat:

```
@workspace Use the sonar-copilot MCP server to show me all SonarLint issues in my project
```

## Step 5: Fix Your First Issue! (1 minute)

```
@workspace Show me a CRITICAL SonarLint issue and help me fix it
```

---

## Common First-Time Commands

### See All Issues
```
@workspace Use sonar-copilot to get a summary of all code quality issues
```

### Fix High-Priority Issues
```
@workspace Use sonar-copilot to find and fix all BLOCKER and CRITICAL issues
```

### Check Specific File
```
@workspace Use sonar-copilot to check MyClass.java for issues
```

### Learn About a Rule
```
@workspace Use sonar-copilot to explain Sonar rule java:S1234
```

---

## Troubleshooting

### "MCP server not found"
- Double-check the path in your config is absolute (not relative)
- Make sure you ran `npm run build`
- Restart IntelliJ

### "No issues found"
- Run **Analyze → Analyze with SonarLint** in IntelliJ first
- Make sure SonarLint plugin is installed
- Check that SonarLint finds issues in the tool window

### "Permission denied"
- Make sure the path is readable
- On Mac/Linux, you might need to check file permissions

---

## What's Next?

- Read [WORKFLOWS.md](WORKFLOWS.md) for detailed usage examples
- Check [README.md](README.md) for comprehensive documentation
- Start maintaining cleaner code! 🚀

---

**You're all set!** Open Copilot Chat and start fixing code quality issues automatically.
