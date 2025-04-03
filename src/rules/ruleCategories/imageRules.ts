import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const imageRules: { [key: string]: Function } = {};

imageRules.hasAltText = (parsedJsx: Node, issues: Issue[]): Issue[] => {
  if (parsedJsx.type === 'img') {
    //check if it has any attributes at all
    if (!parsedJsx.attributes.hasOwnProperty('alt')) {
      //if not, push a missing altId issue
      issues.push({
        line: parsedJsx.location.startLine,
        column: parsedJsx.location.startColumn,
        endLine: parsedJsx.location.endLine,
        endColumn: parsedJsx.location.endColumn,
        message: `Images should have alt ID.`,
        fix: 'Please add "alt" attribute. Decorative/nonfunctional images may use empty string as alt ID.',
        severity: 'warning',
      });
    }
  }
  return issues;
};

export default imageRules;
