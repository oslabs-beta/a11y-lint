// -----------------------------
// FILE: src/parsers/index.ts
// DESCRIPTION: Entry point for selecting the appropriate parser (JSX, HTML, CSS)
// based on file extension.
// -----------------------------

import { parseJSX } from './jsxParser';
import { parseHTML } from './htmlParser';
import { parseCSS } from './cssParser';
import { parseSCSS } from './scssParser';

//Sends the code and file type to the appropriate parser
export function parseByType(code: string, filePath: string) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
    return parseJSX(code, filePath);
  }
  if (filePath.endsWith('.html')) {
    return parseHTML(code, filePath);
  }
  if (filePath.endsWith('.css')) {
    return parseCSS(code, filePath);
  }
  if (filePath.endsWith('.scss')) {
    return parseSCSS(code, filePath);
  }
  return [];
}
