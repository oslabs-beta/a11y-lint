// -----------------------------
// FILE: src/core/linter.ts
// DESCRIPTION: Coordinates the linting process. Retrieves text from the document,
// passes it to the parser, and returns a list of issues.
// -----------------------------

import * as fs from 'fs';
import { parseByType } from '../parsers/index';
import { Issue } from '../types/issue';

// Step 2 - it extracts the text from file and picks a parser to use based off file type
export function lintDocument(filePath: string): Issue[] {
  console.log(`🚨 Linting file: ${filePath}`);

  console.log('lintDocument function reached 🗿');
  const code = fs.readFileSync(filePath, 'utf-8');
  //send to parsers
  return parseByType(code, filePath);
}
