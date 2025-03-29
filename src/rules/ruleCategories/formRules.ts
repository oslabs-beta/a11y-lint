import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const formRules: { [key: string]: Function } = {};

formRules.labelInputs = (
  parsedJsx: Node,
  previousNode: Node,
  issues: Issue[]
): Issue[] => {
  //EXTENSION: check the htmlFor for each label and find its corresponding input
  if (previousNode.type !== 'label') {
    issues.push({
      line: parsedJsx.location.lineStart,
      column: parsedJsx.location.colStart,
      endLine: parsedJsx.location.lineEnd,
      endColumn: parsedJsx.location.colEnd,
      message: `Input fields should be labeled.`,
      fix: 'Please add a label tag. Use "htmlFor" attribute to assign label to the specific input it marks.',
      severity: 'warning',
    });
  }
  return issues;
};

formRules.useFieldsetLegend = (
  parsedJsx: Node,
  nextNode: Node,
  prevNode: Node,
  issues: Issue[]
): Issue[] => {
  if (nextNode.type === 'fieldset' || prevNode.type === 'fieldset') {
    return issues;
  } else {
    issues.push({
      line: parsedJsx.location.lineStart,
      column: parsedJsx.location.colStart,
      endLine: parsedJsx.location.lineEnd,
      endColumn: parsedJsx.location.colEnd,
      message: `Consider using <fieldset> and <legend> tags.`,
      fix: 'If suitable, a <fieldset> can be used to group form items and a <legend> tag used to label them.',
      severity: 'information',
    });
  }

  return issues;
};

export default formRules;
