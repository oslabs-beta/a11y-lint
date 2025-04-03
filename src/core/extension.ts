// -----------------------------`
// FILE: src/core/extension.ts
// DESCRIPTION: Entry point for the VS Code extension. Registers the linter
// and connects it to VS Code's diagnostics system when a file is saved.
// -----------------------------

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as postcss from 'postcss';
import { lintDocument } from './linter';
import { toDiagnostics } from './diagnostic';
import { getAllDependents, getFilesForSelector } from './dependencyGraph';

//this is for getting the selectors so we know what files need to be linted
// formats so (.btn:hover, #nav .link) is just .btn or #nav
function extractCssSelectors(code: string): string[] {
  const selectors: string[] = [];
  const root = postcss.parse(code);

  root.walkRules((rule) => {
    rule.selector
      .split(',')
      .map((s) => s.trim().split(/\s|:/)[0])
      .forEach((sel) => {
        if (sel.startsWith('.') || sel.startsWith('#')) {
          selectors.push(sel);
        }
      });
  });

  return selectors;
}

//here we are going to lint every file so we get all of our dependencies mapped out
//this way we dont have to save a file in a correct order to get the maps
async function preloadAllFiles(diagnostics: vscode.DiagnosticCollection) {
  const files = await vscode.workspace.findFiles(
    '**/*.{js,jsx,ts,tsx,html,css}',
    '**/node_modules/**'
  );
  //console.log(`🗂 Preloading ${files.length} files...`);

  for (const file of files) {
    const filePath = file.fsPath;
    try {
      const issues = lintDocument(filePath);
      const result = toDiagnostics(issues);
      diagnostics.set(vscode.Uri.file(filePath), result);
    } catch (err) {
      console.warn(`⚠️ Failed to parse ${filePath}`, err);
    }
  }
  //console.log('✅ Finished preloading dependency graph');
}

export async function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('🔥 A11YLint activated!');
  const diagnostics = vscode.languages.createDiagnosticCollection('a11ylint');
  //preload
  await preloadAllFiles(diagnostics);

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((document) => {
      const filePath = document.document.fileName;
      //console.log(`📁 Saved file: ${filePath}`);
      //we create a set and add the current file being saved
      const allToLint = new Set<string>();
      allToLint.add(filePath);

      //first we get the dependents of the file and add them to our set
      getAllDependents(filePath).forEach((dep) => allToLint.add(dep));
      //then console log out what we are going to lint
      // console.log(
      //   '🔗 File-based dependents:',
      //   Array.from(getAllDependents(filePath))
      // );

      // step 2: if its a CSS file relint all files using its selectors
      // at some point we need to work on the nested components and stuff
      if (filePath.endsWith('.css')) {
        const code = fs.readFileSync(filePath, 'utf-8');
        const selectors = extractCssSelectors(code);
        //console.log('🎯 Extracted selectors:', selectors);

        for (const selector of selectors) {
          const files = getFilesForSelector(selector);
          files.forEach((f) => allToLint.add(f));
        }
      }
      //console.log('🌀 Re-linting these files:', Array.from(allToLint));

      // step 3: relint all affected files and update diagnostics
      for (const file of allToLint) {
        try {
          console.log(`🚨 Linting file: ${file}`);
          const issues = lintDocument(file);
          const result = toDiagnostics(issues);
          diagnostics.set(vscode.Uri.file(file), result);
        } catch (err) {
          console.error(`❌ Error linting ${file}:`, err);
        }
      }
    })
  );

  console.log('🥶 A11yLint is now active');
}

