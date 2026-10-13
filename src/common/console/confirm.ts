import { confirm as confirmPrompt } from '@inquirer/prompts';

export async function confirm(message: string): Promise<boolean> {
  return confirmPrompt({ message, default: true });
}
