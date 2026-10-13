import { input } from '@inquirer/prompts';

export async function inputString(
  message: string,
  validateFn?: (input: string) => boolean | string,
  prefill?: string
): Promise<string> {
  return input({
    message,
    default: prefill,
    // Makes the prefilled text editable, instead of only being
    // used when the input is left empty
    prefill: 'editable',
    validate: validateFn
  });
}
