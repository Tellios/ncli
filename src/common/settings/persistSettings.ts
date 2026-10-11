import {outputJSON} from 'fs-extra';
import {getSettingsFilename} from './getSettingsFilename.ts';
import {type IPersistedSettings} from './IPersistedSettings.ts';
import {type ISettingsFile} from './ISettingsFile.ts';

export const persistSettings = async (
  settings: IPersistedSettings,
): Promise<void> => {
  const settingsFilename = getSettingsFilename();

  const settingsFile: ISettingsFile = {
    version: 1,
    settings,
  };

  await outputJSON(settingsFilename, settingsFile, {
    spaces: 2,
  });
};
