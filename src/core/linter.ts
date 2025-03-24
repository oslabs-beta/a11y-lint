// -----------------------------
// FILE: src/core/linter.ts
// DESCRIPTION: Coordinates the linting process. Retrieves text from the document,
// passes it to the parser, and returns a list of issues.
// -----------------------------

import * as vscode from 'vscode';
import { parseByType } from '../parsers';
import { Issue } from '../types/issue';

export function lintDocument(document: vscode.TextDocument): Issue[] {
  const code = document.getText();
  const filePath = document.fileName;
  return parseByType(code, filePath);
}
