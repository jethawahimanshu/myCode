/**
 * SonarLint issue reader
 * Reads SonarLint issues from IntelliJ IDEA workspace
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'fast-glob';
import type { SonarIssue, SonarLintIssue, SonarRule, WorkspaceConfig } from './types.js';

export class SonarReader {
  private workspacePath: string;
  private sonarLintStoragePath: string;
  private issuesCache: Map<string, SonarIssue[]> = new Map();

  constructor(config: WorkspaceConfig) {
    this.workspacePath = config.workspacePath;
    // Default SonarLint storage path for IntelliJ
    this.sonarLintStoragePath = config.sonarLintStoragePath ||
      path.join(this.workspacePath, '.idea', 'sonarlint');
  }

  /**
   * Get all Sonar issues in the workspace
   */
  async getAllIssues(): Promise<SonarIssue[]> {
    const issues: SonarIssue[] = [];

    // Look for SonarLint issue files in .idea/sonarlint/issuestore
    const issueStorePath = path.join(this.sonarLintStoragePath, 'issuestore');

    try {
      await fs.access(issueStorePath);
    } catch {
      // If issuestore doesn't exist, try to find issues from inspection results
      return this.getIssuesFromInspections();
    }

    // Find all .pb (protobuf) files containing issue data
    const issueFiles = await glob('**/*.pb', {
      cwd: issueStorePath,
      absolute: true
    });

    for (const file of issueFiles) {
      try {
        const fileIssues = await this.parseIssueFile(file);
        issues.push(...fileIssues);
      } catch (error) {
        console.error(`Error parsing issue file ${file}:`, error);
      }
    }

    return issues;
  }

  /**
   * Get issues for a specific file
   */
  async getIssuesForFile(filePath: string): Promise<SonarIssue[]> {
    const allIssues = await this.getAllIssues();
    const normalizedPath = path.normalize(filePath);

    return allIssues.filter(issue => {
      const issueFilePath = path.isAbsolute(issue.filePath)
        ? issue.filePath
        : path.join(this.workspacePath, issue.filePath);
      return path.normalize(issueFilePath) === normalizedPath;
    });
  }

  /**
   * Get issues from IntelliJ inspection results
   * This is a fallback when SonarLint issuestore is not available
   */
  private async getIssuesFromInspections(): Promise<SonarIssue[]> {
    const issues: SonarIssue[] = [];

    // Look for inspection results XML files
    const inspectionPath = path.join(this.workspacePath, '.idea', 'inspectionProfiles');

    try {
      await fs.access(inspectionPath);
      // Parse inspection XML files here if needed
      // For now, return empty array as this requires XML parsing
    } catch {
      console.log('No inspection results found');
    }

    return issues;
  }

  /**
   * Parse a SonarLint issue file
   * Note: SonarLint uses protobuf format which is binary
   * For simplicity, we'll provide a JSON fallback mechanism
   */
  private async parseIssueFile(filePath: string): Promise<SonarIssue[]> {
    const issues: SonarIssue[] = [];

    // Try to read as JSON first (for testing/development)
    const jsonPath = filePath.replace('.pb', '.json');
    try {
      const content = await fs.readFile(jsonPath, 'utf-8');
      const data = JSON.parse(content) as SonarLintIssue[];

      for (const issue of data) {
        issues.push(this.convertSonarLintIssue(issue));
      }
    } catch {
      // Protobuf parsing would go here
      // For now, we'll document that users should export issues as JSON
      console.log(`Skipping binary protobuf file: ${filePath}`);
    }

    return issues;
  }

  /**
   * Convert SonarLint internal format to our format
   */
  private convertSonarLintIssue(issue: SonarLintIssue): SonarIssue {
    return {
      ruleKey: issue.ruleKey,
      message: issue.primaryLocation.message,
      severity: this.convertSeverity(issue.severity),
      filePath: issue.primaryLocation.filePath,
      line: issue.primaryLocation.textRange.startLine,
      column: issue.primaryLocation.textRange.startLineOffset,
      endLine: issue.primaryLocation.textRange.endLine,
      endColumn: issue.primaryLocation.textRange.endLineOffset,
      quickFixes: issue.quickFixes?.map(qf => ({
        message: qf.message || 'Quick fix',
        edits: qf.edits || []
      }))
    };
  }

  /**
   * Convert numeric severity to string
   */
  private convertSeverity(severity: number): SonarIssue['severity'] {
    switch (severity) {
      case 1: return 'BLOCKER';
      case 2: return 'CRITICAL';
      case 3: return 'MAJOR';
      case 4: return 'MINOR';
      case 5: return 'INFO';
      default: return 'INFO';
    }
  }

  /**
   * Get rule details from SonarLint storage
   */
  async getRuleDetails(ruleKey: string): Promise<SonarRule | null> {
    const rulesPath = path.join(this.sonarLintStoragePath, 'rules');

    try {
      await fs.access(rulesPath);

      // Look for rule metadata file
      const ruleFile = path.join(rulesPath, `${ruleKey.replace(':', '_')}.json`);
      const content = await fs.readFile(ruleFile, 'utf-8');
      return JSON.parse(content) as SonarRule;
    } catch {
      // Rule details not found locally
      return null;
    }
  }

  /**
   * Search for issues by rule key
   */
  async getIssuesByRule(ruleKey: string): Promise<SonarIssue[]> {
    const allIssues = await this.getAllIssues();
    return allIssues.filter(issue => issue.ruleKey === ruleKey);
  }

  /**
   * Get summary of issues grouped by severity
   */
  async getIssueSummary(): Promise<Record<string, number>> {
    const allIssues = await this.getAllIssues();
    const summary: Record<string, number> = {
      BLOCKER: 0,
      CRITICAL: 0,
      MAJOR: 0,
      MINOR: 0,
      INFO: 0
    };

    for (const issue of allIssues) {
      summary[issue.severity]++;
    }

    return summary;
  }

  /**
   * Get file content with line numbers for context
   */
  async getFileContext(filePath: string, startLine: number, endLine: number): Promise<string> {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(this.workspacePath, filePath);

    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const lines = content.split('\n');

      const contextLines = lines.slice(
        Math.max(0, startLine - 3),
        Math.min(lines.length, endLine + 3)
      );

      return contextLines
        .map((line, idx) => {
          const lineNum = Math.max(0, startLine - 3) + idx + 1;
          const marker = lineNum >= startLine && lineNum <= endLine ? '>' : ' ';
          return `${marker} ${lineNum.toString().padStart(4)} | ${line}`;
        })
        .join('\n');
    } catch (error) {
      throw new Error(`Failed to read file: ${error}`);
    }
  }
}
