// -----------------------------
// FILE: src/core/diagnostic.ts
// DESCRIPTION: Converts internal Issue objects into VS Code Diagnostic objects
// for display in the Problems panel and inline squiggles.
// -----------------------------

import * as vscode from 'vscode';
import { Issue } from '../types/issue';

export function toDiagnostics(issues: Issue[]): vscode.Diagnostic[] {
  return issues.map((issue) => {
    const range = new vscode.Range(issue.line - 1, 0, issue.line - 1, 100);
    const severity =
      issue.severity === 'error'
        ? vscode.DiagnosticSeverity.Error
        : vscode.DiagnosticSeverity.Warning;

    return new vscode.Diagnostic(range, issue.message, severity);
  });
}
