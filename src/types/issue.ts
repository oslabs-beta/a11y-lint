// -----------------------------
// FILE: src/types/issue.ts
// DESCRIPTION: Defines the Issue interface used throughout the linter to represent
// problems found in code, including file, line, message, severity, and optional fix.
// -----------------------------

export interface Issue {
  line: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  severity?: 'warning' | 'error' | 'hint';
  fix?: string;
}
