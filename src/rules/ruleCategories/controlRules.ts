import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const controlRules: { [key: string]: Function } = {};

controlRules.descriptiveLinks = (parsedJsx: Node, issues: Issue[]): Issue[] => {
  if (!parsedJsx.value && parsedJsx.attributes.hasOwnProperty('href')) {
    issues.push({
      line: parsedJsx.location.startLine,
      column: parsedJsx.location.startColumn,
      endLine: parsedJsx.location.endLine,
      endColumn: parsedJsx.location.endColumn,
      message: `Links should have clear descriptive text.`,
      fix: 'Please add text between <a> tags that describes the purpose of link.',
      severity: 'warning',
    });
  }

  return issues;
};

controlRules.useATag = (parsedJsx: Node, issues: Issue[]): Issue[] => {
  let regex =
    /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  if (parsedJsx.value?.match(regex)) {
    issues.push({
      line: parsedJsx.location.startLine,
      column: parsedJsx.location.startColumn,
      endLine: parsedJsx.location.endLine,
      endColumn: parsedJsx.location.endColumn,
      message: `Links should use <a> tag.`,
      fix: 'Please place hyperlink in <a> tags that describe the purpose of link.',
      severity: 'warning',
    });
  } else {
    for (const obj in parsedJsx.attributes) {
      if (
        parsedJsx.type !== 'img' ||
        (parsedJsx.type === 'img' && obj !== 'src')
      ) {
        console.log(parsedJsx.type);
        if (parsedJsx.attributes[obj].value.match(regex)) {
          {
            issues.push({
              line: parsedJsx.attributes[obj].location.startLine,
              column: parsedJsx.attributes[obj].location.startColumn,
              endLine: parsedJsx.attributes[obj].location.endLine,
              endColumn: parsedJsx.attributes[obj].location.endColumn,
              message: `Links should use <a> tag.`,
              fix: 'Please place hyperlink in <a> tags that describe the purpose of link.',
              severity: 'warning',
            });
          }
        }
      }
    }
  }
  return issues;
};

controlRules.useButtonTag = (parsedJsx: Node, issues: Issue[]): Issue[] => {
  if (parsedJsx.attributes.type.value === 'button') {
    issues.push({
      line: parsedJsx.attributes.type.location.startLine,
      column: parsedJsx.attributes.type.location.startColumn - 1,
      endLine: parsedJsx.attributes.type.location.endLine,
      endColumn: parsedJsx.attributes.type.location.endColumn + 1,
      message: `Buttons should use <button> tag.`,
      fix: 'Please replace <input type="button"> with <button> .',
      severity: 'warning',
    });
  }

  return issues;
};

export default controlRules;
