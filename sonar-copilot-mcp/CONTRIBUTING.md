# Contributing to SonarLint MCP Server

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/yourusername/sonar-copilot-mcp.git
cd sonar-copilot-mcp
```

3. Install dependencies:
```bash
npm install
```

4. Create a branch for your changes:
```bash
git checkout -b feature/your-feature-name
```

## Development Setup

### Prerequisites

- Node.js 18.0.0 or later
- TypeScript knowledge
- Familiarity with MCP (Model Context Protocol)
- IntelliJ IDEA for testing

### Building

```bash
npm run build
```

### Development Mode

Run TypeScript compiler in watch mode:

```bash
npm run dev
```

### Testing Your Changes

1. Build the project
2. Update your IntelliJ `mcp.json` to point to your local build
3. Restart IntelliJ
4. Test using GitHub Copilot Chat

## Project Structure

```
src/
├── index.ts          # MCP server implementation
├── sonar-reader.ts   # SonarLint issue reader
└── types.ts          # TypeScript type definitions
```

## Areas for Contribution

### High Priority

1. **Protobuf Support**: Add native parsing for SonarLint's protobuf issue format
2. **SonarQube API**: Integrate with SonarQube server for real-time issues
3. **Caching**: Implement smart caching to improve performance
4. **Tests**: Add comprehensive unit and integration tests

### Medium Priority

1. **Watch Mode**: Real-time issue monitoring
2. **Multi-project Support**: Handle workspace with multiple projects
3. **Custom Rules**: Support for custom Sonar rules
4. **Issue Filtering**: Advanced filtering options

### Nice to Have

1. **VS Code Support**: Extend to work with VS Code
2. **Eclipse Support**: Add Eclipse compatibility
3. **Quick Fix Integration**: Use SonarLint's built-in quick fixes
4. **Statistics Dashboard**: Generate comprehensive reports

## Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Add JSDoc comments for public functions
- Use meaningful variable names
- Keep functions focused and small

### Example:

```typescript
/**
 * Get all Sonar issues for a specific file
 * @param filePath - Absolute or relative path to the file
 * @returns Promise resolving to array of issues
 */
async getIssuesForFile(filePath: string): Promise<SonarIssue[]> {
  // Implementation
}
```

## Adding New Tools

To add a new MCP tool:

1. Define the schema in `src/index.ts`:
```typescript
const NewToolSchema = z.object({
  param1: z.string().describe('Description'),
  param2: z.number().optional()
});
```

2. Add tool metadata in `ListToolsRequestSchema` handler:
```typescript
{
  name: 'new_tool',
  description: 'What this tool does',
  inputSchema: {
    // Schema definition
  }
}
```

3. Add tool handler in `CallToolRequestSchema` handler:
```typescript
case 'new_tool': {
  const params = NewToolSchema.parse(args);
  // Implementation
  return { content: [{ type: 'text', text: result }] };
}
```

4. Update README with tool documentation

## Testing Guidelines

### Manual Testing Checklist

- [ ] Server starts without errors
- [ ] All tools appear in Copilot
- [ ] Tools return expected data
- [ ] Error handling works correctly
- [ ] Performance is acceptable
- [ ] Documentation is updated

### Test Cases to Cover

1. **Happy Path**: Normal usage scenarios
2. **Edge Cases**: Empty projects, no issues, etc.
3. **Error Cases**: Invalid paths, missing files, etc.
4. **Performance**: Large projects with many issues

## Pull Request Process

1. Update documentation for any new features
2. Test thoroughly in IntelliJ
3. Ensure TypeScript compiles without errors
4. Update CHANGELOG.md
5. Create PR with clear description:
   - What changed
   - Why it changed
   - How to test it

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How you tested these changes

## Checklist
- [ ] Code compiles
- [ ] Tested in IntelliJ
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

## Bug Reports

When reporting bugs, include:

1. **Environment**:
   - Node.js version
   - IntelliJ version
   - GitHub Copilot version
   - OS

2. **Steps to Reproduce**
3. **Expected Behavior**
4. **Actual Behavior**
5. **Error Messages/Logs**

### Example Bug Report

```markdown
**Environment:**
- Node.js: v20.10.0
- IntelliJ: 2024.2.1
- Copilot: 1.5.2.6424
- OS: macOS 14.2

**Steps:**
1. Open project with SonarLint issues
2. Ask Copilot to list issues
3. Server crashes

**Expected:** List of issues returned
**Actual:** Server crashes with "Cannot read property..."

**Logs:**
[Paste error logs]
```

## Feature Requests

For feature requests, describe:

1. **Use Case**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other approaches considered?
4. **Additional Context**: Screenshots, examples, etc.

## Code Review Process

1. Automated checks must pass
2. At least one maintainer review required
3. Address all review comments
4. Squash commits before merge

## Coding Principles

### 1. Fail Gracefully

```typescript
try {
  const issues = await sonarReader.getAllIssues();
  return issues;
} catch (error) {
  console.error('Failed to read issues:', error);
  return []; // Return empty array instead of crashing
}
```

### 2. Provide Context

```typescript
// Bad
throw new Error('Failed');

// Good
throw new Error(`Failed to read file ${filePath}: ${error.message}`);
```

### 3. Type Safety

```typescript
// Bad
function process(data: any) { }

// Good
function process(data: SonarIssue[]) { }
```

### 4. Clear Naming

```typescript
// Bad
async function get(f: string) { }

// Good
async function getIssuesForFile(filePath: string) { }
```

## Performance Considerations

- Cache frequently accessed data
- Avoid reading entire files when possible
- Use streaming for large datasets
- Profile before optimizing

## Security Considerations

- Validate all file paths
- Sanitize user input
- Never execute arbitrary code
- Use `fs.promises` instead of sync operations
- Handle sensitive data carefully

## Documentation

When adding features:

1. Update README.md
2. Add examples to WORKFLOWS.md
3. Update QUICKSTART.md if needed
4. Add inline code comments
5. Update this CONTRIBUTING.md if adding new contribution areas

## Communication

- Be respectful and constructive
- Ask questions if unclear
- Provide context in discussions
- Help others when you can

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review MCP documentation: https://modelcontextprotocol.io

---

**Thank you for contributing!** 🙏
