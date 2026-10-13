import inquirer from 'inquirer';

export async function editString(
  message: string,
  string_: string,
  validateFn?: (input: string) => boolean | string
): Promise<string> {
  const result: any = await inquirer.prompt({
    message,
    default: string_,
    name: 'str',
    type: 'editor',
    validate: validateFn
  });

  return result.str;
}
