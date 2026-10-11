import {ensureFile, readFile} from 'fs-extra';
import {getSettingsFilename} from './get-settings-filename.ts';
import {type SettingsFile} from './settings-file.interface.ts';
import {type PersistedSettings} from './persisted-settings.interface.ts';

export const getSettings = async (): Promise<PersistedSettings> => {
  const settingsFilename = getSettingsFilename();
  await ensureFile(settingsFilename);

  const data = await readFile(settingsFilename, 'utf8');

  if (data === '') {
    return {};
  }

  const settingsFile: SettingsFile = JSON.parse(data);
  return settingsFile.settings;
};
