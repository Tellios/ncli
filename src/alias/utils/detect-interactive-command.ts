/**
Detect commands that need a TTY when not explicitly configured in alias.yml
*/
export const detectInteractiveCommand = (commandText: string): boolean =>
  /(?:^|\s)-it(?:\s|$)/v.test(commandText) ||
  /(?:^|\s)--watch(?:All)?(?:\s|$)/v.test(commandText);

export const resolveStepInteractive = (
  commandText: string,
  stepInteractive?: boolean
): boolean => {
  if (stepInteractive === true) {
    return true;
  }

  return stepInteractive === false
    ? false
    : detectInteractiveCommand(commandText);
};
