import { selectItem, commandBase } from '../../common';
import { getAliases, executeAlias } from '../utils';

export const selectAliasAndExecute = async (): Promise<void> => {
  await commandBase<'na'>(
    async ({ settings, setSetting, workingDirectory }) => {
      const aliases = await getAliases();

      const aliasNames = aliases.map((alias) => alias.name);
      const selectedIndex = await selectItem(
        aliasNames,
        'Select alias to execute',
        settings.lastExecutedAlias
      );

      const alias = aliases[selectedIndex];

      await executeAlias(alias, false, []);
      await setSetting('lastExecutedAlias', alias.name, workingDirectory);
    }
  );
};
