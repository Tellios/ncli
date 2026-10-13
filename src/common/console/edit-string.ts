import { editor } from '@inquirer/prompts';

export async function editString(
  message: string,
  string_: string,
  validateFn?: (input: string) => boolean | string
): Promise<string> {
  return editor({
    message,
    default: string_,
    validate: validateFn
  });
}
