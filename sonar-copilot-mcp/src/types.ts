/**
 * Type definitions for Sonar issues and MCP server
 */

export interface SonarIssue {
  ruleKey: string;
  message: string;
  severity: 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
  filePath: string;
  line: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  quickFixes?: QuickFix[];
}

export interface QuickFix {
  message: string;
  edits: TextEdit[];
}

export interface TextEdit {
  filePath: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  newText: string;
}

export interface SonarRule {
  key: string;
  name: string;
  severity: string;
  type: 'BUG' | 'VULNERABILITY' | 'CODE_SMELL' | 'SECURITY_HOTSPOT';
  description: string;
  htmlDescription?: string;
  tags: string[];
  language?: string;
}

export interface SonarLintIssue {
  engineId: string;
  ruleKey: string;
  severity: number;
  type: string;
  primaryLocation: {
    message: string;
    filePath: string;
    textRange: {
      startLine: number;
      startLineOffset: number;
      endLine: number;
      endLineOffset: number;
    };
  };
  flows?: any[];
  quickFixes?: any[];
}

export interface WorkspaceConfig {
  workspacePath: string;
  sonarLintStoragePath?: string;
}
