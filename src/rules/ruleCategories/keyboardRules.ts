import { Issue } from '../../types/issue';
import { CssSelectorObj, SelectorBlock } from '../../types/css';

const keyboardRules: { [key: string]: Function } = {};

// Make sure there is a visible focus style for interactive elements that are navigated to via keyboard input.
keyboardRules.checkVisibleFocusStyle = (
  selector: string,
  selectorBlock: SelectorBlock,
  issues: Issue[]
): Issue[] => {
  const isFocusSelector = selector.includes(':focus');
  if (!isFocusSelector) {
    return issues;
  }

  const declarations = selectorBlock.declarations;
  let hasVisibleStyle = false;
  let hasHiddenStyle = false;

  for (const property in declarations) {
    const value = declarations[property].value.trim();

    // Check if it has visible focus styles
    if (
      (property === 'outline' && value !== 'none') ||
      property === 'border' ||
      property === 'box-shadow'
    ) {
      hasVisibleStyle = true;
    }

    // Check if they are hiding the focus styles
    if (
      (property === 'opacity' && value === '0') ||
      (property === 'visibility' && value === 'hidden') ||
      (property === 'display' && value === 'none')
    ) {
      hasHiddenStyle = true;
    }
  }

  const outline = declarations['outline']?.value.trim();
  const hasExplicitlyHiddenOutline = outline === 'none' || outline === '0';

  if (!hasVisibleStyle || hasExplicitlyHiddenOutline) {
    issues.push({
      line: selectorBlock.startLine,
      column: selectorBlock.startColumn,
      endLine: selectorBlock.endLine,
      endColumn: selectorBlock.endColumn,
      message: `Selector "${selector}" has no visible focus indicator. Use 'outline', 'box-shadow', or similar.`,
      fix: 'Add a visible focus style like outline, border, or box-shadow.',
      severity: 'warning',
    });
  }

  return issues;
};

keyboardRules.checkMissingFocusStyles = (
  selector: string,
  testSelector: string,
  selectorBlock: SelectorBlock,
  issues: Issue[],
  objValues: string[]
) => {
  const focusSelectors: {[k: string]: boolean} = {};
  for (let i = 0; i<objValues.length; i++){
    if (objValues[i].includes(':focus')){
      const temp = objValues[i].replace(':focus', '');
      focusSelectors[temp] = true;
      // console.log('new focusSelectors: ', focusSelectors);
    }
  }

  const baseSelector = selector.trim();
  const isInteractable = {button: true, a: true, input: true, summary: true, textarea: true, select: true}
  if (!focusSelectors[baseSelector] && isInteractable.hasOwnProperty(testSelector)) {
    issues.push({
      line: selectorBlock.startLine,
      column: selectorBlock.startColumn,
      endLine: selectorBlock.endLine,
      endColumn: selectorBlock.endColumn,
      message: `Interactive element "${selector}" does not define any :focus styles. Keyboard users may not be able to see where focus is.`,
      fix: `Add a :focus with a visible outline or box-shadow to "${selector}"`,
      severity: 'warning',
      selector,
    });
  }
};

export default keyboardRules;
