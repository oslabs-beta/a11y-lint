// -----------------------------`
// FILE: src/core/extension.ts
// DESCRIPTION: Entry point for the VS Code extension. Registers the linter
// and connects it to VS Code's diagnostics system when a file is saved.
// -----------------------------

import * as vscode from 'vscode';
import { lintDocument } from './linter';
import { toDiagnostics } from './diagnostic';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('🔥 A11YLint activated!');
  const diagnostics = vscode.languages.createDiagnosticCollection('a11ylint');

  // Step 1. think of it as an event listener - it is waiting for file saves
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      // Step 2. when file is safe it first goes to lintDocument
      const issues = lintDocument(document);
      // Step 5 - converts results into diagnostics
      const result = toDiagnostics(issues);
      //Step 6- sets the diagnostics, and shows the problems in the code editor
      diagnostics.set(document.uri, result);
    })
  );

  console.log('🥶 A11yLint is now active');
}
