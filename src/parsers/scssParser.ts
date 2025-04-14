import { SCSSRulesFromObject } from '../rules/scssRules';
import { Issue } from '../types/issue';
import { SCSSDeclarations, SCSSSelectorObj, Variable } from '../types/scss';
import postcss from 'postcss';
import scss from 'postcss-scss';

export function parseSCSS(code: string, filePath: string): Issue[] {
  const root = scss.parse(code, { from: filePath });
  console.log('SCSS root Object: ', root);
  const variables: Variable = {};
  const selectors: SCSSSelectorObj = {};
  root.walkDecls((decl) => {
    if (decl.prop.startsWith('$')) {
      variables[decl.prop] = decl.value;
    }
  });

  root.walkRules((rule) => {
    const declarations: SCSSDeclarations = {};
    rule.walkDecls((decl) => {
      if (!decl.prop.startsWith('$')) {
        declarations[decl.prop] = {
          value: decl.value,
          startLine: decl.source!.start!.line,
          startColumn: decl.source!.start!.column,
          endLine: decl.source!.end!.line,
          endColumn: decl.source!.end!.column,
        };
      }
      if (decl.prop.startsWith('$') && decl.value in variables) {
        declarations[decl.prop] = {
          value: variables[decl.value],
          startLine: decl.source!.start!.line,
          startColumn: decl.source!.start!.column,
          endLine: decl.source!.end!.line,
          endColumn: decl.source!.end!.column,
        }
      }
    });

    selectors[rule.selector] = {
      startLine: rule.source!.start!.line,
      startColumn: rule.source!.start!.column,
      endLine: rule.source!.end!.line,
      endColumn: rule.source!.end!.column,
      declarations,
    };
  });
  return SCSSRulesFromObject(selectors, filePath);
}
