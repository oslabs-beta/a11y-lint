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
      line: parsedJsx.location.startLine,
      column: parsedJsx.location.startColumn,
      endLine: parsedJsx.location.endLine,
      endColumn: parsedJsx.location.endColumn,
      message: `Input fields should be labeled.`,
      fix: 'Please add a label tag. Use "htmlFor" attribute to assign label to the specific input it marks.  See WCAG 1.3.1: https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
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
      line: parsedJsx.location.startLine,
      column: parsedJsx.location.startColumn,
      endLine: parsedJsx.location.endLine,
      endColumn: parsedJsx.location.endColumn,
      message: `Consider using <fieldset> and <legend> tags.`,
      fix: 'If suitable, a <fieldset> can be used to group form items and a <legend> tag used to label them.  See WCAG 1.3.1: https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
      severity: 'information',
    });
  }

  return issues;
};

export default formRules;
