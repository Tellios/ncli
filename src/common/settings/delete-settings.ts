import {differenceWith, isEqual} from 'lodash';
import {type NcliCommand} from './ncli-command.ts';
import {type PersistedSetting} from './persisted-setting.interface.ts';
import {getSettings} from './get-settings.ts';
import {persistSettings} from './persist-settings.ts';

export const deleteSettings = async (
  command: NcliCommand,
  settingsToDelete: PersistedSetting[],
): Promise<void> => {
  const settings = await getSettings();
  const commandSettings = settings[command] ?? [];
  const settingsToKeep = differenceWith(
    commandSettings,
    settingsToDelete,
    isEqual,
  );

  // Make sure to remove the command from settings entirely if no
  // settings have been made for the command
  settings[command] = settingsToKeep.length > 0 ? settingsToKeep : undefined;

  await persistSettings(settings);
};
