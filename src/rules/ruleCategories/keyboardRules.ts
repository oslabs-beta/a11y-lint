import { Issue } from '../../types/issue';

const keyboardRules: { [key: string]: Function } = {};

// Make sure there is a visible focus style for interactive elements that are navigated to via keyboard input.
keyboardRules.checkVisibleFocusStyle = () => {};

export default keyboardRules;
