// -----------------------------
// FILE: src/types/issue.ts
// DESCRIPTION: Defines the Issue interface used throughout the linter to represent
// problems found in code, including file, line, message, severity, and optional fix.
// -----------------------------

export interface Issue {
  file: string;
  line: number;
  message: string;
  severity?: 'warning' | 'error';
  fix?: string;
}
