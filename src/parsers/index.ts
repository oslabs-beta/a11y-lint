// -----------------------------
// FILE: src/parsers/index.ts
// DESCRIPTION: Entry point for selecting the appropriate parser (JSX, HTML, CSS)
// based on file extension.
// -----------------------------

import { parseJSX } from './jsxParser';
import { parseHTML } from './htmlParser';
import { parseCSS } from './cssParser';

// step 2 - sends the code and file type to the appropriate parser
export function parseByType(code: string, filePath: string) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
    console.log('➡️ Routing to parseJSX');
    return parseJSX(code, filePath);
  }
  if (filePath.endsWith('.html')) {
    console.log('➡️ Routing to parseHTML');
    return parseHTML(code, filePath);
  }
  if (filePath.endsWith('.css')) {
    console.log('➡️ Routing to parseCSS');
    return parseCSS(code, filePath);
  }
  return [];
}
