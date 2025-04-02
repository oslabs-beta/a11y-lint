import { CssSelectorObj, Declarations } from '../../types/css';
import { Issue } from '../../types/issue';

const appearanceRules: { [key: string]: Function } = {};

appearanceRules.textSize200 = (
  selector: string,
  declarations: Declarations,
  issues: Issue[]
): Issue[] => {
  if (declarations['font-size']) {
    //get the value of the font size
    const value = declarations['font-size'].value.trim();
    let scalable: boolean = false;
    //check if value ends with scalable unit
    if (value.endsWith('rem') || value.endsWith('em') || value.endsWith('%')) {
      scalable = true;
    }
    if (!scalable) {
      issues.push({
        line: declarations['font-size'].startLine,
        column: declarations['font-size'].startColumn,
        endLine: declarations['font-size'].endLine,
        endColumn: declarations['font-size'].endColumn,
        message: `Font size "${value}" is not scalable.`,
        fix: 'Use rem, em, or % instead of a fixed unit like px',
        severity: 'warning',
        selector: selector,
      });
    }
  }
  return issues;
};

export default appearanceRules;
