export const appendNoVerifyIfEnabled = (
  shouldUseNoVerify: boolean,
  args: string[]
): string[] => (shouldUseNoVerify ? [...args, '--no-verify'] : args);
