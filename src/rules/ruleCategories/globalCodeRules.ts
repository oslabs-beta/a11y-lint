import { Issue } from '../../types/issue';
import { HtmlExtractedNode } from '../../types/html';

type RuleFunction = (node: HtmlExtractedNode) => Issue | null;
const globalCodeRules: { [key: string]: RuleFunction } = {
  //************ Test html for missing lang attribute in HTML ****************/
  missingLangAttr: (node) => {
    if (node.type === 'html' && !node.attributes['lang']) {
      return {
        line: node.location?.startLine || 0,
        column: node.location?.startColumn,
        endline: node.location?.endLine || 0,
        endColumn: node.location?.endColumn,
        message:
          '<html> tag is missing a "lang" attribute. See WCAG 3.1.1: https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
        severity: 'error',
      };
    }
    return null;
  },

  //************ Test image tag for missing alt attribute ****************/
  
  //running test from imageRules.ts instead!
  // missingAltAttr: (node) => {
  //   if (node.type === 'img' && !node.attributes['alt']) {
  //     return {
  //       line: node.location?.startLine || 0,
  //       column: node.location?.startColumn,
  //       endline: node.location?.endLine || 0,
  //       endColumn: node.location?.endColumn,
  //       message: '<img> tag is missing an "alt" attribute. See WCAG 1.1.1: https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
  //       severity: 'error',
  //     };
  //   }
  //   return null;
  // },
  avoidAutofocus: (node) => {
    if (node.attributes['autofocus'] || node.attributes['autoFocus']) {
      return {
        line: node.location?.startLine || 0,
        column: node.location?.startColumn,
        endline: node.location?.endLine || 0,
        endColumn: node.location?.endColumn,
        message: `Avoid using the 'autofocus' attribute. It can cause accessibility issues. See WCAG 2.2.2: https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html`,
        severity: 'warning',
        fix: `Remove the 'autofocus' attribute and let users control focus.`,
      };
    }
    return null;
  },

  //ensure that viewport zoom is not disabled
  resizeTextRules: (node) => {
    if (node.type === 'meta' && node.attributes?.name?.value === 'viewport') {
      const content = node.attributes?.content.value || '';
      if (
        content.includes('maximum-scale=1') ||
        content.includes('user-scalable=no')
      ) {
        return {
          line: node.location?.startLine || 0,
          column: node.location?.startColumn,
          endline: node.location?.endLine || 0,
          endColumn: node.location?.endColumn,
          message: `Avoid disabling zoom. Users may need to resize text.`,
          severity: 'warning',
          fix: `Remove maximum-scale=1 and user-scalable=no`,
        };
      }
    }
    return null;
  },
};

export default globalCodeRules;
