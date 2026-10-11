import inquirer from 'inquirer';

export async function confirm(message: string): Promise<boolean> {
  const choice: any = await inquirer.prompt([
    {
      type: 'list',
      name: 'result',
      message,
      choices: ['Yes', 'No'],
    },
  ]);

  return choice.result === 'Yes';
}
