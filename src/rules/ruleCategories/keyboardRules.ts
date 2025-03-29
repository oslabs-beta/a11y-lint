import { Issue } from '../../types/issue';
import { CssSelectorObj, SelectorBlock } from '../../types/css';

const keyboardRules: { [key: string]: Function } = {};

// Make sure there is a visible focus style for interactive elements that are navigated to via keyboard input.
keyboardRules.checkVisibleFocusStyle = (
  selector: string,
  selectorBlock: SelectorBlock,
  issues: Issue[]
): Issue[] => {
  //check if a focus selector exists on this selector block
  const isFocusSelector = selector.includes(':focus');
  if (!isFocusSelector) {
    return issues;
  }
  //grab the declarations
  const declarations = selectorBlock.declarations;
  //we will check if they have manually removed the outline or are lacking visible style
  let hasVisibleStyle = false;
  let hasHiddenStyle = false;

  for (const property in declarations) {
    const value = declarations[property].value.trim();

    //check if it has visible focus styles
    if (
      (property === 'outline' && value !== 'none') ||
      property === 'border' ||
      property === 'box-shadow'
    ) {
      hasVisibleStyle = true;
    }

    //check if they are hiding the focus styles
    if (
      (property === 'opacity' && value === '0') ||
      (property === 'visibility' && value === 'hidden') ||
      (property === 'display' && value === 'none')
    ) {
      hasHiddenStyle = true;
    }
  }

  if (!hasVisibleStyle && !hasHiddenStyle) {
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

keyboardRules.checkMissingFocusStyles = (
  selector: string,
  selectorBlock: SelectorBlock,
  issues: Issue[],
  focusSelectors: Set<string>
): Issue[] => {
  //check if it has a focus
  if (selector.includes(':focus')) {
    return issues;
  }

  //check if theres another selector that adds a :focus
  let hasFocusFriend: boolean = false;
  for (const focusSelector of focusSelectors) {
    if (focusSelector.startsWith(`${selector}:`)) {
      hasFocusFriend = true;
      break;
    }
  }

  //if it has a match return issues
  if (hasFocusFriend) {
    return issues;
  }

  //check if it is an interactive element
  if (
    !selector.includes('button') &&
    !selector.includes('input') &&
    !selector.includes('select') &&
    !selector.includes('textarea') &&
    !selector.includes('a')
  ) {
    return issues;
  }

  issues.push({
    line: selectorBlock.startLine,
    column: selectorBlock.startColumn,
    endLine: selectorBlock.endLine,
    endColumn: selectorBlock.endColumn,
    message: `Interactive element "${selector}" does not define any :focus styles. Keyboard users may not be able to see where focus is.`,
    fix: 'Add a :focus with a visible outline',
    severity: 'warning',
  });
  return issues;
};

export default keyboardRules;
