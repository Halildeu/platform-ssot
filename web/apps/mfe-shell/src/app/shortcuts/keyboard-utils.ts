/**
 * Checks if the event target is an editable element (input, textarea, contentEditable).
 * Used by keyboard shortcut handlers to avoid intercepting normal typing.
 */
export const isEditableElement = (target: EventTarget | null): boolean => {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  if (target.isContentEditable) {
    return true;
  }

  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.getAttribute('role') === 'textbox'
  );
};
