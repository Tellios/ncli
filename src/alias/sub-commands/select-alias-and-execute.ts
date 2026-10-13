import { selectItem, commandBase } from '../../common/index.ts';
import { getAliases, executeAlias } from '../utils/index.ts';

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
