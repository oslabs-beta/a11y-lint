// -----------------------------
// FILE: src/core/extension.ts
// DESCRIPTION: Entry point for the VS Code extension. Registers the linter
// and connects it to VS Code's diagnostics system when a file is saved.
// -----------------------------

import * as vscode from 'vscode';
import { lintDocument } from './linter';
import { toDiagnostics } from './diagnostic';

export function activate(context: vscode.ExtensionContext) {
  const diagnostics = vscode.languages.createDiagnosticCollection('a11ylint');

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      const issues = lintDocument(document);
      const result = toDiagnostics(issues);
      diagnostics.set(document.uri, result);
    })
  );

  console.log('🥶 A11yLint is now active');
}
