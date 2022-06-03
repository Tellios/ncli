import { ConsoleInterface, commandBase } from '../../common';
import { getAliases, getAliasHelpTableContent } from '../utils';

export const listAliases = async (): Promise<void> => {
  await commandBase(async () => {
    const aliases = await getAliases();

    aliases.forEach((alias) => {
      const helpContent = getAliasHelpTableContent(alias);
      ConsoleInterface.printVerticalTable(helpContent);
    });
  });
};
