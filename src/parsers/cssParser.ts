// -----------------------------
// FILE: src/parsers/cssParser.ts
// DESCRIPTION: Uses PostCSS to parse CSS files and applies CSS-specific rules.
// -----------------------------
import * as vscode from 'vscode';
import postcss from 'postcss';

export const cssParse = (cssFile: string) => {
  const root = postcss.parse(cssFile);
  
};

export function parseCSS(code: string, filePath: string) {
  // TODO: Use postcss + cssRules
  return [];
}
