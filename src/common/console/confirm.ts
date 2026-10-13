import inquirer from 'inquirer';

export async function confirm(message: string): Promise<boolean> {
  const choice = await inquirer.prompt<{ result: 'Yes' | 'No' }>([
    {
      type: 'list',
      name: 'result',
      message,
      choices: ['Yes', 'No']
    }
  ]);

  return choice.result === 'Yes';
}
