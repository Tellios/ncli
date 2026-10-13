import { commandBase } from '../../common/index.ts';
import { getAliases, executeAlias } from '../utils/index.ts';

export const executeMatchingAlias = async (args: string[]): Promise<void> => {
  await commandBase(async () => {
    const aliases = await getAliases();
    let isPrint = false;

    if (args[0] === '--print') {
      isPrint = true;
      args.shift();
    }

    const matchingAlias = aliases.find((item) => item.name === args[0]);

    if (matchingAlias === undefined) {
      throw new Error(`No alias matching ${args[0]}`);
    }

    await executeAlias(matchingAlias, isPrint, args.slice(1));
  });
};
