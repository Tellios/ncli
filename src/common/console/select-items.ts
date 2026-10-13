import { checkbox } from '@inquirer/prompts';

export type SelectItemsParameters = {
  items: string[];
  message?: string;
  searchString?: string;
};

export async function selectItems({
  items,
  message = 'Select an item',
  searchString
}: SelectItemsParameters): Promise<number[]> {
  if (items.length === 0) {
    throw new Error('Items must be an instantiated array with items');
  }

  let choices = items.map((item, index) => ({ name: item, value: index }));

  if (searchString !== undefined && searchString.length > 0) {
    const loweredSearchString = searchString.toLowerCase();
    choices = choices.filter((choice) =>
      choice.name.toLowerCase().includes(loweredSearchString)
    );

    if (choices.length === 0) {
      throw new Error(`No items matches the search filter: ${searchString}`);
    }
  }

  return checkbox({
    message,
    pageSize: 10,
    choices
  });
}
