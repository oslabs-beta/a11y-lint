import { cssSelectorObj, declarations } from '../../types/css';
import { Issue } from '../../types/issue';
import tinycolor from 'tinycolor2';

const contrastRules: { [key: string]: Function } = {};

contrastRules.checkContrast = (declarations: declarations, issues: Issue[]) => {
  if (declarations['color'] && declarations['background-color']) {
    console.log('you are in contrast if statement 🍣');
    let color = tinycolor(declarations['color'].value);
    console.log(color);
    const backgroundColor = tinycolor(declarations['background-color'].value);
    if (
      tinycolor.isReadable(
        color.toHexString(),
        backgroundColor.toHexString()
      ) === false
    ) {
      issues.push({
        line: declarations['color'].startLine,
        column: declarations['color'].startColumn,
        endLine: declarations['color'].endLine,
        endColumn: declarations['color'].endColumn,
        message: `Contrast is not high enough.`,
        fix: 'Choose color with higher contrast`',
        severity: 'warning',
      });
    }
  }
};

export default contrastRules;
