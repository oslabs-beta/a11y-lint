import { CssSelectorObj, Declarations, SelectorBlock } from '../../types/css';
import { Issue } from '../../types/issue';
import tinycolor from 'tinycolor2';

const contrastRules: { [key: string]: Function } = {};

contrastRules.checkContrast = (
  selector: string,
  declarations: Declarations,
  issues: Issue[]
) => {
  //checking to see if there is an attribute of color and background color if there is there will eb contrast
  if (declarations['color'] && declarations['background-color']) {
    //console.log('you are in contrast if statement 🍣');
    //converting color equal to rbg/hex using tinycolor
    let color = tinycolor(declarations['color'].value);
    //console.log(color);
    //converting color equal to rbg/hex using tinycolor
    const backgroundColor = tinycolor(declarations['background-color'].value);
    //invoking tiny color method isReadabel.  This tests if the contrast between color and background color is above a 4.5
    if (
      tinycolor.isReadable(
        color.toHexString(),
        backgroundColor.toHexString()
      ) === false
    ) {
      //if above statement is false adding the issue to the issues array
      issues.push({
        line: declarations['color'].startLine,
        column: declarations['color'].startColumn,
        endLine: declarations['color'].endLine,
        endColumn: declarations['color'].endColumn,
        message: `Contrast is not high enough.`,
        fix: 'Choose color with higher contrast`',
        severity: 'warning',
        selector: selector,
      });
    }
  }
};

contrastRules.checkButtonBorder = (
  selector: string,
  selectorBlock: SelectorBlock,
  issues: Issue[]
) => {
  //console.log('button start line: ', parsedCSS['button'].startLine);
  if (selector === 'button') {
    if (!selectorBlock.declarations.border) {
      issues.push({
        line: selectorBlock.startLine,
        column: selectorBlock.startColumn,
        endLine: selectorBlock.endLine,
        endColumn: selectorBlock.endColumn,
        message: `No border on button element`,
        fix: 'Add border attribute to button',
        severity: 'warning',
        selector: selector,
      });
    }
  }
};

export default contrastRules;
