import process from 'node:process';
import { uniqBy } from 'es-toolkit';
import { ConsoleInterface, Type } from '../console/index.ts';
import { type NcliCommand } from './ncli-command.ts';
import { type Settings } from './settings.interface.ts';
import { type PersistedSetting } from './persisted-setting.interface.ts';
import { type PersistedSettings } from './persisted-settings.interface.ts';

export const getAggregatedCommandSettings = async (
  command: NcliCommand,
  settings: PersistedSettings,
  directory = process.cwd()
): Promise<Settings> => {
  const commandSettings = settings[command] ?? [];

  const settingsInScope = getSettingsInCurrentScope(commandSettings, directory);
  const uniqueSettingKeys: string[] = getUniqueSettingKeys(settingsInScope);

  return getAggregatedSettings(uniqueSettingKeys, settingsInScope);
};

const getSettingsInCurrentScope = (
  settings: PersistedSetting[],
  directory: string
): PersistedSetting[] =>
  settings.filter(
    (s) => s.scope === 'global' || s.workingDirectory === directory
  );

const getUniqueSettingKeys = (settings: PersistedSetting[]): string[] =>
  uniqBy(settings, (s) => s.key).map((s) => s.key);

const getAggregatedSettings = (
  keys: string[],
  settings: PersistedSetting[]
): Settings =>
  keys.reduce((aggregatedSettings: Settings, key) => {
    const global = getGlobalSetting(settings, key);
    const workingDirectory = getWorkingDirectorySetting(settings, key);
    const value = getAggregatedValue(global, workingDirectory);

    if (value === undefined) {
      ConsoleInterface.printLine(
        `Setting '${key}' is unexpectedly missing a value`,
        Type.warn
      );
    } else {
      aggregatedSettings[key] = value;
    }

    return aggregatedSettings;
  }, {});

const getGlobalSetting = (
  settings: PersistedSetting[],
  key: string
): PersistedSetting | undefined =>
  settings.find((s) => s.key === key && s.scope === 'global');

const getWorkingDirectorySetting = (
  settings: PersistedSetting[],
  key: string
): PersistedSetting | undefined =>
  settings.find((s) => s.key === key && s.scope === 'workingDirectory');

const getAggregatedValue = (
  global?: PersistedSetting,
  workingDirectory?: PersistedSetting
): boolean | string | undefined => workingDirectory?.value ?? global?.value;
