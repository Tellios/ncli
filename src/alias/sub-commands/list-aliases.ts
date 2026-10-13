import { ConsoleInterface, commandBase } from '../../common/index.ts';
import { getAliases, getAliasHelpTableContent } from '../utils/index.ts';

export const listAliases = async (): Promise<void> => {
  await commandBase(async () => {
    const aliases = await getAliases();

    for (const alias of aliases) {
      const helpContent = getAliasHelpTableContent(alias);
      ConsoleInterface.printVerticalTable(helpContent);
    }
  });
};
