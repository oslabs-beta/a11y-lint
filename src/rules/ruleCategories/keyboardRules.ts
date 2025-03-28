import { Issue } from '../../types/issue';
import { CssSelectorObj, SelectorBlock } from '../../types/css';

const keyboardRules: { [key: string]: Function } = {};

// Make sure there is a visible focus style for interactive elements that are navigated to via keyboard input.
keyboardRules.checkVisibleFocusStyle = (
  selector: string,
  selectorBlock: SelectorBlock,
  issues: Issue[]
) => {
  //check if a focus selector exists on this selector block
  const isFocusSelector = selector.includes(':focus');
  if (!isFocusSelector) {
    return issues;
  }
  //grab the declarations
  const declarations = selectorBlock.declarations;
  //we will check if they have manually removed the outline or are lacking visible style
  let hasVisibleStyle = false;

  for (const property in declarations) {
    const value = declarations[property].value.trim();
    if (
      (property === 'outline' && value !== 'none') ||
      property === 'border' ||
      property === 'box-shadow'
    ) {
      hasVisibleStyle = true;
    }
  }

  if (!hasVisibleStyle) {
    issues.push({
      line: selectorBlock.startLine,
      column: selectorBlock.startColumn,
      endLine: selectorBlock.endLine,
      endColumn: selectorBlock.endColumn,
      message: `Selector "${selector}" removes focus style with 'outline: none' but doesn't provide a visible replacement.`,
      fix: 'Add a visible focus indicator like outline, border, or box-shadow.',
      severity: 'warning',
    });
  }

  return issues;
};

export default keyboardRules;
