#!/usr/bin/env node

/**
 * SonarLint MCP Server for GitHub Copilot
 *
 * This MCP server provides tools for GitHub Copilot to read and resolve
 * SonarLint issues in IntelliJ IDEA projects.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { SonarReader } from './sonar-reader.js';
import { z } from 'zod';

// Get workspace path from environment or command line
const WORKSPACE_PATH = process.env.WORKSPACE_PATH || process.cwd();

// Initialize Sonar reader
const sonarReader = new SonarReader({
  workspacePath: WORKSPACE_PATH
});

// Create MCP server
const server = new Server(
  {
    name: 'sonar-copilot-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool: list_sonar_issues
 * Lists all SonarLint issues in the workspace or for a specific file
 */
const ListSonarIssuesSchema = z.object({
  filePath: z.string().optional().describe('Optional: Filter issues for a specific file path'),
  severity: z.enum(['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO']).optional()
    .describe('Optional: Filter by severity level'),
  ruleKey: z.string().optional().describe('Optional: Filter by specific rule key')
});

/**
 * Tool: get_sonar_issue_details
 * Get detailed information about a specific Sonar issue including context
 */
const GetSonarIssueDetailsSchema = z.object({
  filePath: z.string().describe('Path to the file containing the issue'),
  line: z.number().describe('Line number where the issue occurs'),
  ruleKey: z.string().optional().describe('Optional: Rule key for additional filtering')
});

/**
 * Tool: get_sonar_rule_info
 * Get detailed information about a Sonar rule
 */
const GetSonarRuleInfoSchema = z.object({
  ruleKey: z.string().describe('The Sonar rule key (e.g., "java:S1234")')
});

/**
 * Tool: get_sonar_summary
 * Get a summary of all Sonar issues grouped by severity
 */
const GetSonarSummarySchema = z.object({});

/**
 * Tool: get_file_context
 * Get file content around a specific line with context
 */
const GetFileContextSchema = z.object({
  filePath: z.string().describe('Path to the file'),
  line: z.number().describe('Center line number'),
  contextLines: z.number().optional().default(5).describe('Number of lines before/after to include')
});

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_sonar_issues',
        description: 'List all SonarLint issues in the workspace. Can filter by file path, severity, or rule key. Returns issue details including location and message.',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Optional: Filter issues for a specific file path (relative to workspace root)'
            },
            severity: {
              type: 'string',
              enum: ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'],
              description: 'Optional: Filter by severity level'
            },
            ruleKey: {
              type: 'string',
              description: 'Optional: Filter by specific rule key (e.g., "java:S1234")'
            }
          }
        }
      },
      {
        name: 'get_sonar_issue_details',
        description: 'Get detailed information about a specific Sonar issue including surrounding code context. Useful for understanding the issue before fixing it.',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to the file containing the issue'
            },
            line: {
              type: 'number',
              description: 'Line number where the issue occurs'
            },
            ruleKey: {
              type: 'string',
              description: 'Optional: Rule key for additional filtering'
            }
          },
          required: ['filePath', 'line']
        }
      },
      {
        name: 'get_sonar_rule_info',
        description: 'Get detailed information about a Sonar rule including description, severity, type, and best practices for fixing. Essential for understanding how to properly resolve an issue.',
        inputSchema: {
          type: 'object',
          properties: {
            ruleKey: {
              type: 'string',
              description: 'The Sonar rule key (e.g., "java:S1234")'
            }
          },
          required: ['ruleKey']
        }
      },
      {
        name: 'get_sonar_summary',
        description: 'Get a summary of all Sonar issues grouped by severity. Useful for understanding the overall code quality and prioritizing fixes.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_file_context',
        description: 'Get file content around a specific line with context lines before and after. Useful for understanding the code structure when fixing issues.',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to the file'
            },
            line: {
              type: 'number',
              description: 'Center line number'
            },
            contextLines: {
              type: 'number',
              description: 'Number of lines before/after to include (default: 5)',
              default: 5
            }
          },
          required: ['filePath', 'line']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'list_sonar_issues': {
        const params = ListSonarIssuesSchema.parse(args);
        let issues = params.filePath
          ? await sonarReader.getIssuesForFile(params.filePath)
          : await sonarReader.getAllIssues();

        // Apply filters
        if (params.severity) {
          issues = issues.filter(issue => issue.severity === params.severity);
        }
        if (params.ruleKey) {
          issues = issues.filter(issue => issue.ruleKey === params.ruleKey);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                totalIssues: issues.length,
                issues: issues.map(issue => ({
                  ruleKey: issue.ruleKey,
                  message: issue.message,
                  severity: issue.severity,
                  filePath: issue.filePath,
                  line: issue.line,
                  column: issue.column
                }))
              }, null, 2)
            }
          ]
        };
      }

      case 'get_sonar_issue_details': {
        const params = GetSonarIssueDetailsSchema.parse(args);
        const issues = await sonarReader.getIssuesForFile(params.filePath);

        let issue = issues.find(i => i.line === params.line);
        if (params.ruleKey) {
          issue = issues.find(i => i.line === params.line && i.ruleKey === params.ruleKey);
        }

        if (!issue) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            `No issue found at ${params.filePath}:${params.line}`
          );
        }

        // Get code context
        const context = await sonarReader.getFileContext(
          params.filePath,
          issue.line,
          issue.endLine || issue.line
        );

        // Get rule details
        const ruleDetails = await sonarReader.getRuleDetails(issue.ruleKey);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                issue: {
                  ruleKey: issue.ruleKey,
                  message: issue.message,
                  severity: issue.severity,
                  filePath: issue.filePath,
                  line: issue.line,
                  column: issue.column,
                  endLine: issue.endLine,
                  endColumn: issue.endColumn
                },
                ruleDetails: ruleDetails ? {
                  name: ruleDetails.name,
                  type: ruleDetails.type,
                  description: ruleDetails.description,
                  tags: ruleDetails.tags
                } : null,
                codeContext: context,
                quickFixes: issue.quickFixes || []
              }, null, 2)
            }
          ]
        };
      }

      case 'get_sonar_rule_info': {
        const params = GetSonarRuleInfoSchema.parse(args);
        const ruleDetails = await sonarReader.getRuleDetails(params.ruleKey);

        if (!ruleDetails) {
          // Return basic info if detailed info not available
          const issues = await sonarReader.getIssuesByRule(params.ruleKey);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  ruleKey: params.ruleKey,
                  occurrences: issues.length,
                  message: 'Detailed rule information not available locally. Consider checking SonarQube documentation.',
                  exampleIssues: issues.slice(0, 3).map(i => ({
                    message: i.message,
                    filePath: i.filePath,
                    line: i.line
                  }))
                }, null, 2)
              }
            ]
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                key: ruleDetails.key,
                name: ruleDetails.name,
                severity: ruleDetails.severity,
                type: ruleDetails.type,
                description: ruleDetails.description,
                tags: ruleDetails.tags,
                language: ruleDetails.language
              }, null, 2)
            }
          ]
        };
      }

      case 'get_sonar_summary': {
        const summary = await sonarReader.getIssueSummary();
        const total = Object.values(summary).reduce((a, b) => a + b, 0);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                totalIssues: total,
                bySeverity: summary,
                priorityRecommendation: summary.BLOCKER > 0
                  ? 'Fix BLOCKER issues first'
                  : summary.CRITICAL > 0
                    ? 'Fix CRITICAL issues first'
                    : summary.MAJOR > 0
                      ? 'Address MAJOR issues'
                      : 'Good! Focus on MINOR and INFO issues for code quality'
              }, null, 2)
            }
          ]
        };
      }

      case 'get_file_context': {
        const params = GetFileContextSchema.parse(args);
        const contextLines = params.contextLines || 5;
        const context = await sonarReader.getFileContext(
          params.filePath,
          params.line,
          params.line
        );

        return {
          content: [
            {
              type: 'text',
              text: context
            }
          ]
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.message}`
      );
    }
    throw error;
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('SonarLint MCP Server running on stdio');
  console.error(`Workspace: ${WORKSPACE_PATH}`);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
