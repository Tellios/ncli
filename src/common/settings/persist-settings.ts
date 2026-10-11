import {outputJSON} from 'fs-extra';
import {getSettingsFilename} from './get-settings-filename.ts';
import {type PersistedSettings} from './persisted-settings.interface.ts';
import {type SettingsFile} from './settings-file.interface.ts';

export const persistSettings = async (
  settings: PersistedSettings,
): Promise<void> => {
  const settingsFilename = getSettingsFilename();

  const settingsFile: SettingsFile = {
    version: 1,
    settings,
  };

  await outputJSON(settingsFilename, settingsFile, {
    spaces: 2,
  });
};
