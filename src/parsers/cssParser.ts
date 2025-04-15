// -----------------------------
// FILE: src/parsers/cssParser.ts
// DESCRIPTION: Uses PostCSS to parse CSS files and applies CSS-specific rules.
// -----------------------------

import * as vscode from 'vscode';
import postcss from 'postcss';
import { CssSelectorObj } from '../types/css';
import { cssRulesFromObject } from '../rules/cssRules';
import { Issue } from '../types/issue';
import {
  registerSelectorDeclarations,
  addSelectorDefinition,
} from '../core/dependencyGraph';
import { splitSelector } from '../core/splitSelector';

export function parseCSS(code: string, filePath: string): Issue[] {
  console.log('parseCSS fucntion reached 🥩');
  const root = postcss.parse(code);
  //empty object I will be storing information in
  const outputObj: CssSelectorObj = {};

  //method walk Rules is built in method of postcss.  walk Rules in AST esetially goes to each node of a certain type which is "rules" and in this case rules are each tag (i.e. <button> <h1> <div>)
  root.walkRules((rule) => {
    //selecting the spefici tag so I can set it equal to th key of the object
    const selector = rule.selector;
    // console.log(selector)
    //checking if the tag already exists in the object.  If it doesn't add it set it equal to a key with the value as an empty object
    if (!outputObj[selector]) {
      outputObj[selector] = {
        declarations: {},
        startLine: rule.source!.start!.line,
        startColumn: rule.source!.start!.column,
        endLine: rule.source!.end!.line,
        endColumn: rule.source!.end!.column,
      };

      //we add this to the selector decs - first we have to split it
      const parts = splitSelector(selector);
      for (const part of parts) {
        registerSelectorDeclarations(part, outputObj[selector]);
        addSelectorDefinition(part, filePath);
      }
    }
    //console.log(outputObj)
    //walkDecls is a method of postCSS that goes through each Declaration (attribute)
    rule.walkDecls((decl) => {
      //setting the key equal to the prop and the values are all the info we want
      outputObj[selector].declarations[decl.prop] = {
        value: decl.value,
        startLine: decl.source!.start!.line,
        startColumn: decl.source!.start!.column,
        endLine: decl.source!.end!.line,
        endColumn: decl.source!.end!.column,
      };
    });
  });
  //console.log('output:', outputObj);
  return cssRulesFromObject(outputObj, filePath);
}
