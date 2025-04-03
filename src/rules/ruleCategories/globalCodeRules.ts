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
  missingUniqueTitle: (node) => {
    if (node.type === 'title' && (!node.value || node.value.trim() === '')) {
      //console.log(node.value);
      return {
        line: node.location?.startLine || 0,
        column: node.location?.startCol,
        endline: node.location?.endLine || 0,
        endColumn: node.location?.endCol,
        message: '<title> Pages must have a descriptive title. See WCAG 2.4.2: https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
        severity: 'error',
      };
    }
    return null;
  },
  // //************ Test html tag for missing RTF attribute if lang is RTF lang ****************/
  // rightToLeftLang: (node) => {
  //   console.log("RT fucntion reached");
  //   if (node.type === 'html' && node.attributes.lang.value === "ar" || "he") {
  //     console.log("first if statement", );
  //     if(!node.attributes.dir || node.attributes.dir.value !== "rtl") {
  //       console.log("second if statement")
  //       return {
  //         line: node.location?.startLine || 0,
  //         column: node.location?.startCol,
  //         endline: node.location?.endLine || 0,
  //         endColumn: node.location?.endCol,
  //         message: '<html> attribute must contain a "dir" attribute that is "RTL" for Arabic and Hebrew. See WCAG 1.4.8: https://www.w3.org/TR/WCAG22/#visual-presentation',
  //         severity: 'warning',
  //       };
  //     }
  //   }
  //   return null;
  // },
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
