/** Detect commands that need a TTY when not explicitly configured in alias.yml */
export const detectInteractiveCommand = (commandText: string): boolean => {
  if (/(?:^|\s)-it(?:\s|$)/.test(commandText)) {
    return true;
  }

  if (/(?:^|\s)--watch(?:All)?(?:\s|$)/.test(commandText)) {
    return true;
  }

  return false;
};

export const resolveStepInteractive = (
  commandText: string,
  stepInteractive?: boolean
): boolean => {
  if (stepInteractive === true) {
    return true;
  }

  if (stepInteractive === false) {
    return false;
  }

  return detectInteractiveCommand(commandText);
};
