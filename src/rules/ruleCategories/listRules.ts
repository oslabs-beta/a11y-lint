import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const listRules: { [key: string]: Function } = {};

listRules.useListElements = (
  node: Node,
  prevNode: Node,
  nextNode: Node,
  issues: Issue[]
): Issue[] => {
  const charOne = node.value?.charAt(0);
  const nextCharOne = nextNode.value?.charAt(0);
  const prevCharOne = prevNode.value?.charAt(0);

  if (
    charOne === '-' ||
    charOne === '•' ||
    charOne === '—' ||
    charOne === '◦'
  ) {
    {
      issues.push({
        line: node.location.lineStart,
        column: node.location.colStart,
        endLine: node.location.lineEnd,
        endColumn: node.location.colEnd,
        message: `Lists should use list elements.`,
        fix: 'Please wrap your list in <ul>, <ol>, or <dl> tags.',
        severity: 'warning',
      });
    }
  } else if (!Number.isNaN(charOne)) {
    if (
      Number(charOne) === Number(prevCharOne) + 1 ||
      Number(charOne) === Number(nextCharOne) - 1
    ) {
      {
        issues.push({
          line: node.location.lineStart,
          column: node.location.colStart,
          endLine: node.location.lineEnd,
          endColumn: node.location.colEnd,
          message: `Lists should use list elements.`,
          fix: 'Please wrap your list in <ul>, <ol>, or <dl> tags.',
          severity: 'warning',
        });
      }
    }
  }
  return issues;
};

export default listRules;
