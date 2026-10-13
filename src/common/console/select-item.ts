import { search } from '@inquirer/prompts';

export async function selectItem(
  items: string[],
  message = 'Select an item',
  preSelectedItem?: string
): Promise<number> {
  if (items.length === 0) {
    throw new Error('Items must be an instantiated array with items');
  }

  const choices = items.map((item, index) => ({ name: item, value: index }));
  const preSelectedIndex = preSelectedItem
    ? items.indexOf(preSelectedItem)
    : -1;

  return search({
    message,
    pageSize: 10,
    default: preSelectedIndex === -1 ? undefined : preSelectedIndex,
    source: (term) => choices.filter((c) => c.name.includes(term ?? ''))
  });
}
