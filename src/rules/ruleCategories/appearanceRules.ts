import { cssSelectorObj, declarations } from '../../types/css';
import { Issue } from '../../types/issue';

const appearanceRules: { [key: string]: Function } = {};

appearanceRules.textSize200 = (
  declarations: declarations,
  decl: string,
  issues: Issue[]
) => {
  if (decl === 'font-size') {
    //get the value of the font size
    const value = declarations[decl].value.trim();
    let scalable: boolean = false;
    5;
    //check if value ends with scalable unit
    if (value.endsWith('rem') || value.endsWith('em') || value.endsWith('%')) {
      scalable = true;
    }
    if (!scalable) {
      issues.push({
        line: declarations[decl].startLine,
        column: declarations[decl].startColumn,
        endLine: declarations[decl].endLine,
        endColumn: declarations[decl].endColumn,
        message: `Font size "${value}" is not scalable.`,
        fix: 'Use rem, em, or % instead of a fixed unit like px',
        severity: 'warning',
      });
    }
  }
  return issues;
};

export default appearanceRules;
