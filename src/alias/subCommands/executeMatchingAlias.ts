import { commandBase } from '../../common';
import { getAliases, executeAlias } from '../utils';

export const executeMatchingAlias = async (args: string[]): Promise<void> => {
  commandBase(async () => {
    const aliases = await getAliases();
    let print = false;

    if (args[0] === '--print') {
      print = true;
      args.splice(0, 1);
    }

    const matchingAlias = aliases.find((item) => {
      return item.name === args[0];
    });

    if (matchingAlias === undefined) {
      throw Error(`No alias matching ${args[0]}`);
    }

    await executeAlias(matchingAlias, print, args.slice(1));
  });
};
