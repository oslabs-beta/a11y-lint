// -----------------------------
// FILE: src/core/linter.ts
// DESCRIPTION: Coordinates the linting process. Retrieves text from the document,
// passes it to the parser, and returns a list of issues.
// -----------------------------

import * as vscode from 'vscode';
import { parseByType } from '../parsers';
import { Issue } from '../types/issue';

export function lintDocument(document: vscode.TextDocument): Issue[] {
  //turning entire file into a string
  const code = document.getText();
  //name of file currently selected by user
  const filePath = document.fileName;
  //this function will deteermine what type of file is being parsed (HTML, JSX, CSS)
  return parseByType(code, filePath);
}
