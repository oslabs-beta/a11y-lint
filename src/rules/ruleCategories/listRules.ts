import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const listRules: { [key: string]: Function } = {};

listRules.useListElements = (
  node: Node,
  prevVal: string,
  nextVal: string,
  issues: Issue[]
): Issue[] => {
  console.log('here we are in listRules');
  const charOne = node.value?.charAt(0);
  // const next = nextNode.value || ' '
  // const prev = prevNode.value || ' '
  const nextCharOne = nextVal.charAt(0);
  const prevCharOne = prevVal.charAt(0);
  console.log('list rules characters: ', Number(charOne), " ", Number(prevCharOne), " ", Number(nextCharOne));
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
  } else if (!Number.isNaN(Number(charOne))) {
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
