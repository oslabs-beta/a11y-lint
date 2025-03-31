import { Issue } from '../../types/issue';
import { HtmlExtractedNode } from '../../types/html';

type RuleFunction = (node: HtmlExtractedNode) => Issue | null;
const globalCodeRules: { [key: string]: RuleFunction } = {
  //************ Test html for missing lang attribute in HTML ****************/
  missingLangAttr: (node) => {
    if (node.type === 'html' && !node.attributes['lang']) {
      return {
        line: node.location?.startLine || 0,
        column: node.location?.startCol,
        endline: node.location?.endLine || 0,
        endColumn: node.location?.endCol,
        message:
          '<html> tag is missing a "lang" attribute. WCAG Reference [1.3.1], [3.1.1]',
        severity: 'error',
      };
    }
    return null;
  },
  //************ Test image tag for missing alt attribute ****************/
  missingUniqueTitle: (node) => {
    if (node.type === 'title' && (!node.value || node.value.trim() === '')) {
      console.log(node.value);
      return {
        line: node.location?.startLine || 0,
        column: node.location?.startCol,
        endline: node.location?.endLine || 0,
        endColumn: node.location?.endCol,
        message: '<title> Pages must have a descriptive title',
        severity: 'error',
      };
    }
    return null;
  },

  //************ Test image tag for missing alt attribute ****************/
  missingAltAttr: (node) => {
    if (node.type === 'img' && !node.attributes['alt']) {
      return {
        line: node.location?.startLine || 0,
        column: node.location?.startCol,
        endline: node.location?.endLine || 0,
        endColumn: node.location?.endCol,
        message: '<img> tag is missing an "alt" attribute.',
        severity: 'error',
      };
    }
    return null;
  },
  avoidAutofocus: (node) => {
    if (node.attributes['autofocus'] || node.attributes['autoFocus']) {
      return {
        line: node.location?.startLine || 0,
        column: node.location?.startCol,
        endline: node.location?.endLine || 0,
        endColumn: node.location?.endCol,
        message: `Avoid using the 'autofocus' attribute. It can cause accessibility issues.`,
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
          column: node.location?.startCol,
          endline: node.location?.endLine || 0,
          endColumn: node.location?.endCol,
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
