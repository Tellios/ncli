import process from 'node:process';
import {uniqBy} from 'lodash';
import {ConsoleInterface, Type} from '../console/index.ts';
import {type NcliCommand} from './NcliCommand.ts';
import {type ISettings} from './ISettings.ts';
import {type IPersistedSetting} from './IPersistedSetting.ts';
import {type IPersistedSettings} from './IPersistedSettings.ts';

export const getAggregatedCommandSettings = async (
  command: NcliCommand,
  settings: IPersistedSettings,
  directory = process.cwd(),
): Promise<ISettings> => {
  const commandSettings = settings[command] ?? [];

  const settingsInScope = getSettingsInCurrentScope(commandSettings, directory);
  const uniqueSettingKeys: string[] = getUniqueSettingKeys(settingsInScope);

  return getAggregatedSettings(uniqueSettingKeys, settingsInScope);
};

const getSettingsInCurrentScope = (
  settings: IPersistedSetting[],
  directory: string,
): IPersistedSetting[] =>
  settings.filter(
    (s) => s.scope === 'global' || s.workingDirectory === directory,
  );

const getUniqueSettingKeys = (settings: IPersistedSetting[]): string[] =>
  uniqBy(settings, (s) => s.key).map((s) => s.key);

const getAggregatedSettings = (
  keys: string[],
  settings: IPersistedSetting[],
): ISettings =>
  keys.reduce((aggregatedSettings: ISettings, key) => {
    const global = getGlobalSetting(settings, key);
    const workingDirectory = getWorkingDirectorySetting(settings, key);
    const value = getAggregatedValue(global, workingDirectory);

    if (value === undefined) {
      ConsoleInterface.printLine(
        `Setting '${key}' is unexpectedly missing a value`,
        Type.warn,
      );
    } else {
      aggregatedSettings[key] = value;
    }

    return aggregatedSettings;
  }, {});

const getGlobalSetting = (
  settings: IPersistedSetting[],
  key: string,
): IPersistedSetting | undefined =>
  settings.find((s) => s.key === key && s.scope === 'global');

const getWorkingDirectorySetting = (
  settings: IPersistedSetting[],
  key: string,
): IPersistedSetting | undefined =>
  settings.find((s) => s.key === key && s.scope === 'workingDirectory');

const getAggregatedValue = (
  global?: IPersistedSetting,
  workingDirectory?: IPersistedSetting,
): boolean | string | undefined => workingDirectory?.value ?? global?.value;
