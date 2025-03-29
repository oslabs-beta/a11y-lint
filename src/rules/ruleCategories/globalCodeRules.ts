import { Issue } from '../../types/issue';
import { HtmlExtractedNode } from '../../types/html';

type RuleFunction = (node: HtmlExtractedNode) => Issue | null;
const globalCodeRules: { [key: string]: RuleFunction } = {
  missingLangAttr: (node) => {
    if (node.type === 'html' && !node.attributes['lang']) {
      return {
        line: node.location?.startLine || 0,
        column: node.location?.startCol,
        endline: node.location?.endLine || 0,
        endColumn: node.location?.endCol,
        message: '<html> tag is missing a "lang" attribute.',
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
};

export default globalCodeRules;
