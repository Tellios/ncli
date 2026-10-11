export const appendNoVerifyIfEnabled = (
  useNoVerify: boolean,
  args: string[],
): string[] => (useNoVerify ? [...args, '--no-verify'] : args);
