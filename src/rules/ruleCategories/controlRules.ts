import { input } from '@testing-library/user-event/dist/cjs/event/input.js';
import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const controlRules: { [key: string]: Function } = {};

controlRules.descriptiveLinks = (parsedJsx: Node, issues: Issue[]): Issue[] => {
  console.log(parsedJsx);
  if (
    parsedJsx.type === 'a' &&
    !parsedJsx.value &&
    parsedJsx.attributes.hasOwnProperty('href')
  ) {
    issues.push({
      line: parsedJsx.location.lineStart,
      column: parsedJsx.location.colStart - 1,
      endLine: parsedJsx.location.lineEnd,
      endColumn: parsedJsx.location.colEnd + 1,
      message: `Links should have clear descriptive text.`,
      fix: 'Please add text between <a> tags that describes the purpose of link.',
      severity: 'warning',
    });
  }

  return issues;
};

controlRules.useButtonTag = (parsedJsx: Node, issues: Issue[]): Issue[] => {
  if (parsedJsx.attributes.type.value === 'button') {
    issues.push({
      line: parsedJsx.attributes.type.location.lineStart,
      column: parsedJsx.attributes.type.location.colStart - 1,
      endLine: parsedJsx.attributes.type.location.lineEnd,
      endColumn: parsedJsx.attributes.type.location.colEnd + 1,
      message: `Buttons should use <button> tag.`,
      fix: 'Please replace <input type="button"> with <button> .',
      severity: 'warning',
    });
  }

  return issues;
};

export default controlRules;
