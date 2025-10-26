# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-26

### Added
- Initial release of SonarLint MCP Server
- MCP server implementation with stdio transport
- Integration with SonarLint issue storage
- Five core tools for GitHub Copilot:
  - `list_sonar_issues`: List all or filtered SonarLint issues
  - `get_sonar_issue_details`: Get detailed issue information with context
  - `get_sonar_rule_info`: Get Sonar rule descriptions
  - `get_sonar_summary`: Get issue summary by severity
  - `get_file_context`: Get code context around specific lines
- Support for severity-based filtering (BLOCKER, CRITICAL, MAJOR, MINOR, INFO)
- Support for rule-based filtering
- Support for file-specific issue queries
- Automatic code context extraction
- IntelliJ IDEA integration via MCP configuration
- Comprehensive documentation:
  - README.md with full setup instructions
  - QUICKSTART.md for fast onboarding
  - WORKFLOWS.md with detailed usage examples
  - CONTRIBUTING.md with contributor guidelines
- TypeScript implementation with strict type checking
- Example MCP configuration for IntelliJ
- MIT License

### Features
- Works with any language supported by SonarLint (Java, JavaScript, Python, etc.)
- Prioritization recommendations based on issue severity
- Detailed error messages and validation
- Environment variable support for workspace path
- Compatible with GitHub Copilot Agent Mode

### Documentation
- Installation and setup guide
- Configuration examples for IntelliJ IDEA
- Troubleshooting section
- Architecture overview
- Development guidelines
- Six detailed workflow examples
- API reference for all MCP tools

### Developer Experience
- TypeScript with strict mode
- Zod schema validation
- Fast-glob for efficient file searching
- Source maps for debugging
- Watch mode for development

## [Unreleased]

### Planned
- Protobuf parsing for native SonarLint issue format
- SonarQube Server API integration
- Issue caching for improved performance
- Real-time issue monitoring (watch mode)
- Multi-project workspace support
- VS Code extension
- Eclipse plugin support
- Automated testing suite
- Performance benchmarks
- Machine learning-based fix suggestions

---

## Version History

- **1.0.0** (2025-10-26): Initial release with core functionality
