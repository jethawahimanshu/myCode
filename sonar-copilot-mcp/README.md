# SonarLint MCP Server for GitHub Copilot

An MCP (Model Context Protocol) server that enables GitHub Copilot to automatically read and resolve SonarLint issues in IntelliJ IDEA projects.

## Features

- **Automatic Issue Detection**: Reads SonarLint issues directly from your IntelliJ workspace
- **Smart Context Extraction**: Provides Copilot with code context around issues
- **Rule Information**: Accesses detailed Sonar rule descriptions for better fixes
- **Severity Filtering**: Prioritize fixes by issue severity
- **Bulk Operations**: Get summaries and fix multiple issues efficiently

## Prerequisites

- **IntelliJ IDEA** (2024.2 or later) with GitHub Copilot plugin installed
- **SonarLint plugin** installed and configured in IntelliJ
- **Node.js** 18.0.0 or later
- **GitHub Copilot** subscription with Agent Mode enabled

## Installation

### 1. Install the MCP Server

```bash
# Clone or download this repository
cd sonar-copilot-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

### 2. Configure in IntelliJ IDEA

#### Option A: Global Configuration

1. Open IntelliJ IDEA
2. Click the **GitHub Copilot** icon in the status bar
3. Select **Edit Settings**
4. Navigate to the **MCP Servers** section
5. Add the following configuration:

```json
{
  "mcpServers": {
    "sonar-copilot": {
      "command": "node",
      "args": [
        "/absolute/path/to/sonar-copilot-mcp/dist/index.js"
      ],
      "env": {
        "WORKSPACE_PATH": "${workspaceFolder}"
      }
    }
  }
}
```

Replace `/absolute/path/to/sonar-copilot-mcp` with the actual path where you installed the server.

#### Option B: Project Configuration

1. Create a `.vscode` directory in your project root (IntelliJ respects this for MCP configuration)
2. Create a file `.vscode/mcp.json` with the same configuration as above
3. Restart IntelliJ or reload the Copilot plugin

### 3. Verify Installation

1. Open GitHub Copilot Chat in IntelliJ (usually via the sidebar or `Ctrl+Shift+P` → "Copilot Chat")
2. Type: `@workspace What MCP servers are available?`
3. You should see `sonar-copilot` listed

## Available Tools

The MCP server provides the following tools to GitHub Copilot:

### 1. `list_sonar_issues`
Lists all SonarLint issues in the workspace.

**Parameters:**
- `filePath` (optional): Filter issues for a specific file
- `severity` (optional): Filter by severity (`BLOCKER`, `CRITICAL`, `MAJOR`, `MINOR`, `INFO`)
- `ruleKey` (optional): Filter by specific rule key

### 2. `get_sonar_issue_details`
Get detailed information about a specific issue including code context.

**Parameters:**
- `filePath` (required): Path to the file
- `line` (required): Line number of the issue
- `ruleKey` (optional): Rule key for filtering

### 3. `get_sonar_rule_info`
Get detailed information about a Sonar rule.

**Parameters:**
- `ruleKey` (required): The Sonar rule key (e.g., `java:S1234`)

### 4. `get_sonar_summary`
Get a summary of all issues grouped by severity.

### 5. `get_file_context`
Get file content around a specific line.

**Parameters:**
- `filePath` (required): Path to the file
- `line` (required): Center line number
- `contextLines` (optional): Number of lines before/after (default: 5)

## Usage Examples

### Example 1: Get Overview of All Issues

```
In Copilot Chat:
"Use the sonar-copilot MCP server to show me all SonarLint issues in my project"
```

Copilot will use the `list_sonar_issues` tool and present a summary.

### Example 2: Fix Critical Issues

```
In Copilot Chat:
"Show me all CRITICAL SonarLint issues and fix them one by one"
```

Copilot will:
1. Use `list_sonar_issues` with severity filter
2. For each issue, use `get_sonar_issue_details` to understand context
3. Use `get_sonar_rule_info` to understand the rule
4. Suggest fixes and apply them

### Example 3: Fix Issues in Specific File

```
In Copilot Chat:
"Fix all SonarLint issues in src/main/java/com/example/MyClass.java"
```

Copilot will:
1. Use `list_sonar_issues` with filePath filter
2. Analyze each issue
3. Propose and apply fixes

### Example 4: Understand a Specific Rule

```
In Copilot Chat:
"Explain SonarLint rule java:S1234 and show me where it's violated in my code"
```

Copilot will use `get_sonar_rule_info` and `list_sonar_issues` to provide comprehensive information.

### Example 5: Bulk Fix Session

```
In Copilot Chat:
"Start an agent session to fix all BLOCKER and CRITICAL SonarLint issues in my project"
```

Copilot Agent Mode will:
1. Get the summary
2. Systematically go through each high-severity issue
3. Fix them with proper context

## Advanced Configuration

### Custom SonarLint Storage Path

If your SonarLint storage is in a non-standard location:

```json
{
  "mcpServers": {
    "sonar-copilot": {
      "command": "node",
      "args": [
        "/path/to/sonar-copilot-mcp/dist/index.js"
      ],
      "env": {
        "WORKSPACE_PATH": "${workspaceFolder}",
        "SONARLINT_STORAGE_PATH": "/custom/path/to/.idea/sonarlint"
      }
    }
  }
}
```

Update the `SonarReader` constructor in `src/sonar-reader.ts` to use `process.env.SONARLINT_STORAGE_PATH`.

### Development Mode

To run the server in development mode with auto-reload:

```bash
npm run dev
```

### Debugging

The server logs to stderr (visible in IntelliJ's MCP server logs):

1. Open IntelliJ
2. Go to **Help** → **Diagnostic Tools** → **Debug Log Settings**
3. Add `copilot.mcp`
4. Check logs in **Help** → **Show Log in Finder/Explorer**

## Troubleshooting

### Server Not Appearing in Copilot

1. Verify the path in `mcp.json` is absolute and correct
2. Ensure `npm run build` completed successfully
3. Restart IntelliJ IDEA
4. Check IntelliJ logs for MCP-related errors

### No Issues Found

1. Ensure SonarLint plugin is installed and active
2. Run SonarLint analysis on your project (**Analyze** → **Analyze with SonarLint**)
3. Check that issues appear in the SonarLint tool window
4. Verify the workspace path is correct

### Issues Not Parsing

The server currently looks for JSON exports of SonarLint issues. If issues are stored in protobuf format:

1. The server will log a message about skipping protobuf files
2. You can extend `src/sonar-reader.ts` to parse protobuf files (requires `protobufjs` dependency)
3. Alternatively, export issues to JSON format for development

### Permission Errors

Ensure the server has read access to:
- `.idea/sonarlint/` directory
- Project source files
- Any custom SonarLint storage paths

## Architecture

```
┌─────────────────────┐
│  IntelliJ IDEA      │
│  + GitHub Copilot   │
│  + SonarLint        │
└──────────┬──────────┘
           │
           │ MCP Protocol (stdio)
           │
┌──────────▼──────────┐
│  sonar-copilot-mcp  │
│  MCP Server         │
├─────────────────────┤
│  Tools:             │
│  - list_issues      │
│  - get_details      │
│  - get_rule_info    │
│  - get_summary      │
│  - get_context      │
└──────────┬──────────┘
           │
           │ File System Access
           │
┌──────────▼──────────┐
│  .idea/sonarlint/   │
│  Project Files      │
└─────────────────────┘
```

## Development

### Project Structure

```
sonar-copilot-mcp/
├── src/
│   ├── index.ts          # MCP server implementation
│   ├── sonar-reader.ts   # SonarLint issue reader
│   └── types.ts          # TypeScript type definitions
├── dist/                 # Compiled JavaScript (generated)
├── .vscode/
│   └── mcp.json          # Example MCP configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Testing

```bash
# Run the server directly to test
WORKSPACE_PATH=/path/to/your/project node dist/index.js
```

### Contributing

Contributions are welcome! Areas for improvement:

- [ ] Protobuf parsing for native SonarLint issue format
- [ ] Support for SonarQube Server integration
- [ ] Caching of issue data
- [ ] Watch mode for real-time issue updates
- [ ] Support for other IDEs (VS Code, Eclipse)
- [ ] Quick fix suggestions from SonarLint API

## How It Works

1. **Issue Detection**: The server reads SonarLint's local storage (`.idea/sonarlint/issuestore/`)
2. **MCP Protocol**: Exposes tools via the Model Context Protocol
3. **GitHub Copilot Integration**: Copilot Agent Mode can call these tools
4. **Context Provision**: Server provides code context and rule information
5. **AI-Powered Fixes**: Copilot generates and applies fixes based on context

## Supported Languages

The server works with any language supported by SonarLint:
- Java
- JavaScript/TypeScript
- Python
- PHP
- C/C++
- C#
- Go
- Kotlin
- Ruby
- And more...

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Integrates with [SonarLint](https://www.sonarsource.com/products/sonarlint/)
- Powered by [GitHub Copilot](https://github.com/features/copilot)

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the [MCP documentation](https://modelcontextprotocol.io)
- Review [GitHub Copilot docs](https://docs.github.com/copilot)

## Roadmap

- [ ] v1.1: Direct SonarQube API integration
- [ ] v1.2: Machine learning-based fix suggestions
- [ ] v1.3: Multi-project workspace support
- [ ] v2.0: Real-time issue monitoring and auto-fix

---

**Happy coding with cleaner code!** 🚀
