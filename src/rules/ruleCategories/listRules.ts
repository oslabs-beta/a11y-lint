import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const listRules: { [key: string]: Function } = {};

listRules.useListElements = (
  node: Node,
  prevVal: string,
  nextVal: string,
  issues: Issue[]
): Issue[] => {
  const charOne = node.value?.charAt(0);
  const nextCharOne = nextVal.charAt(0);
  const prevCharOne = prevVal.charAt(0);
  if (
    charOne === '-' ||
    charOne === '•' ||
    charOne === '—' ||
    charOne === '◦'
  ) {
    {
      issues.push({
        line: node.location.startLine,
        column: node.location.startColumn,
        endLine: node.location.endLine,
        endColumn: node.location.endColumn,
        message: `Lists should use list elements.`,
        fix: 'Please wrap your list in <ul>, <ol>, or <dl> tags. See WCAG 1.3.1: https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.htmll',
        severity: 'warning',
      });
    }
  } else if (!Number.isNaN(Number(charOne))) {
    if (
      Number(charOne) === Number(prevCharOne) + 1 ||
      Number(charOne) === Number(nextCharOne) - 1
    ) {
      {
        issues.push({
          line: node.location.startLine,
          column: node.location.startColumn,
          endLine: node.location.endLine,
          endColumn: node.location.endColumn,
          message: `Lists should use list elements.`,
          fix: 'Please wrap your list in <ul>, <ol>, or <dl> tags. https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
          severity: 'warning',
        });
      }
    }
  }
  return issues;
};

export default listRules;
