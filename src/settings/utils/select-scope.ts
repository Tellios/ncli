import { selectItem, type SettingScope } from '../../common/index.ts';

export const selectScope = async (): Promise<SettingScope> => {
  const index = await selectItem([
    'Global - setting will apply for all usages of the command',
    'Working Directory - setting will apply when used in the current directory (overrides global settings)'
  ]);

  return index === 0 ? 'global' : 'workingDirectory';
};
