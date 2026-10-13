import inquirer from 'inquirer';

export async function inputString(
  message: string,
  validateFn?: (input: string) => boolean | string,
  prefill?: string
): Promise<string> {
  const prompt = inquirer.prompt({
    message,
    name: 'input',
    type: 'input',
    default: prefill,
    validate: validateFn
  });

  if (prefill) {
    // Writing to the readline makes the text editable, unlike
    // inquirer's default which is only used for empty input
    // (prompt as any).ui.rl.write(prefill);
  }

  const result: any = await prompt;

  return result.input;
}
