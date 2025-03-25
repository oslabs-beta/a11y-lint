// -----------------------------
// FILE: src/core/linter.ts
// DESCRIPTION: Coordinates the linting process. Retrieves text from the document,
// passes it to the parser, and returns a list of issues.
// -----------------------------

import * as vscode from 'vscode';
import { parseByType } from '../parsers/index';
import { Issue } from '../types/issue';

// Step 2 - it extracts the text from file and picks a parser to use based off file type
export function lintDocument(document: vscode.TextDocument): Issue[] {
  const code = document.getText();
  const filePath = document.fileName;
  return parseByType(code, filePath);
}
