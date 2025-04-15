// -----------------------------
// FILE: src/parsers/index.ts
// DESCRIPTION: Entry point for selecting the appropriate parser (JSX, HTML, CSS)
// based on file extension.
// -----------------------------

import { parseJSX } from './jsxParser';
import { parseHTML } from './htmlParser';
import { parseCSS } from './cssParser';

//Sends the code and file type to the appropriate parser
export function parseByType(code: string, filePath: string) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
    console.log('➡️ Routing to parseJSX');
    return parseJSX(code, filePath);
  }
  if (filePath.endsWith('.html')) {
    console.log('➡️ Routing to parseHTML');
    //createParentChildObj(code, filePath);
    return parseHTML(code, filePath);

  }
  if (filePath.endsWith('.css')) {
    console.log('➡️ Routing to parseCSS');
    return parseCSS(code, filePath);
  }
  //! WHY ARE WE RETURNING AN EMPTY ARRAY HERE?
  return [];
}
