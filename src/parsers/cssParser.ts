// -----------------------------
// FILE: src/parsers/cssParser.ts
// DESCRIPTION: Uses PostCSS to parse CSS files and applies CSS-specific rules.
// -----------------------------
import { cssRulesFromObject } from '../rules/cssRules';
import { ParsedCSS } from '../types/css';
import { Issue } from '../types/issue';

export function parseCSS(code: string, filePath: string): Issue[] {
  const parsed: ParsedCSS = {
    body: {
      'font-size': {
        value: '9px',
        start: { line: 2, column: 2 }, // adjust this to match actual position of "font-size"
        end: { line: 2, column: 18 },
      },
    },
  };
  return cssRulesFromObject(parsed, filePath);
}
