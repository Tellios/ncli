import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';

inquirer.registerPrompt('autocomplete', autocomplete);

export async function selectItem(
  items: string[],
  message?: string,
  preSelectedItem?: string,
): Promise<number> {
  if (items.length === 0) {
    throw 'Items must be an instantiated array with items';
  }

  if (message === undefined) {
    message = 'Select an item';
  }

  const selectableItems = getSelectableItems(items, preSelectedItem);

  const choice: any = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'item',
      pageSize: 10,
      message,
      source: async (_: any, input?: string): Promise<string[]> =>
        selectableItems.filter((i) => i.includes(input ?? '')),
    },
  ]);

  return items.indexOf(choice.item);
}

function getSelectableItems(
  items: string[],
  preSelectedItem?: string,
): string[] {
  const preSelectedIndex = getPreSelectedIndex(items, preSelectedItem);

  if (preSelectedIndex === undefined) {
    return items;
  }

  const partOne = items.slice(0, preSelectedIndex);
  const partTwo = items.slice(preSelectedIndex);

  return [...partTwo, ...partOne];
}

function getPreSelectedIndex(
  items: string[],
  preSelectedItem?: string,
): number | undefined {
  const preSelectedIndex = items.indexOf(preSelectedItem);
  return preSelectedIndex === -1 ? undefined : preSelectedIndex;
}
