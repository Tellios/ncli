import * as inquirer from 'inquirer';

export interface ISelectItemsParams {
  items: string[];
  message?: string;
  searchString?: string;
}

export async function selectItems({
  items,
  message = 'Select an item',
  searchString
}: ISelectItemsParams): Promise<number[]> {
  if (items.length === 0) {
    throw 'Items must be an instantiated array with items';
  }

  let choices = items;

  if (searchString) {
    const loweredSearchString = searchString.toLowerCase();
    choices = choices.filter((choice) =>
      choice.toLowerCase().includes(loweredSearchString)
    );

    if (choices.length === 0) {
      throw `No items matches the search filter: ${searchString}`;
    }
  }

  const choice = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'item',
      pageSize: 10,
      message,
      choices
    }
  ]);

  return choice.item.map((item: string) => items.indexOf(item));
}
