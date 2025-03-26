// -----------------------------
// FILE: src/parsers/cssParser.ts
// DESCRIPTION: Uses PostCSS to parse CSS files and applies CSS-specific rules.
// -----------------------------
/*
import { cssRulesFromObject } from '../rules/cssRules';
import { ParsedCSS } from '../types/css';
import { Issue } from '../types/issue';

// step 3 - parses code and calls the rules
export function parseCSS(code: string, filePath: string): Issue[] {
  const parsed: ParsedCSS = {
    body: {
      'font-size': {
        value: '9px',
        start: { line: 2, column: 2 },
        end: { line: 2, column: 18 },
      },
    },
  };
  return cssRulesFromObject(parsed, filePath);
}
*/
import * as vscode from 'vscode';
import postcss from 'postcss';
import { cssSelectorObj } from '../types/cssType';
import { cssRulesFromObject } from '../rules/cssRules';
import { Issue } from '../types/issue';

export function parseCSS(code: string, filePath: string): Issue[] {
  console.log('parseCSS fucntion reached 🥩')
  const root = postcss.parse(code);
  //empty object I will be storing information in
  const outputObj: cssSelectorObj = {};

  //method walk Rules is built in method of postcss.  walk Rules in AST esetially goes to each node of a certain type which is "rules" and in this case rules are each tag (i.e. <button> <h1> <div>)
  root.walkRules((rule) => {
    //selecting the spefici tag so I can set it equal to th key of the object
    const selector = rule.selector;
    // console.log(selector)
    //checking if the tag already exists in the object.  If it doesn't add it set it equal to a key with the value as an empty object
    if (!outputObj[selector]) {
      outputObj[selector] = {};
      //console.log(outputObj)
    }
    //walkDecls is a method of postCSS that goes through each Declaration (attribute)
    rule.walkDecls((decl) => {
      //setting the key equal to the prop and the values are all the info we want
      outputObj[selector][decl.prop] = {
        value: decl.value,
        startLine: decl.source!.start!.line,
        startColumn: decl.source!.start!.column,
        endLine: decl.source!.end!.line,
        endColumn: decl.source!.end!.column,
      };
    });
  });
  console.log(outputObj);
  return cssRulesFromObject(outputObj, filePath);
}
