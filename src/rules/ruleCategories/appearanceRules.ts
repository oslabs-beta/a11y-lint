import { cssSelectorObj, declarations } from '../../types/css';
import { Issue } from '../../types/issue';

const appearanceRules: { [key: string]: Function } = {};

appearanceRules.textSize200 = (
  declarations: declarations,
  decl: string,
  issues: Issue[]
) => {
  if (decl === 'font-size') {
    console.log('you are in if statement 🧛‍♂️');
    //get the value of the font size
    const numericValue = parseInt(declarations[decl].value);
    console.log(numericValue);
    if (numericValue < 16) {
      issues.push({
        line: declarations[decl].startLine,
        column: declarations[decl].startColumn,
        endLine: declarations[decl].endLine,
        endColumn: declarations[decl].endColumn,
        message: `Font size of ${numericValue}px is too small for readability.`,
        fix: 'Use at least 16px font size for body text.',
        severity: 'warning',
      });
    }
  }
  return issues;
};

export default appearanceRules;
