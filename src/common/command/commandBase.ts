import * as process from 'process';
import * as path from 'path';
import { ConsoleInterface, Type, CmdError } from '../console';
import {
  getSettings,
  getAggregatedCommandSettings,
  NcliCommand,
  ISettingsFor,
  IAvailableSettings,
  updateSetting,
  SettingValue
} from '../settings';

export interface IExecutorParams<T extends NcliCommand> {
  workingDirectory: string;
  settings: ISettingsFor<T>;
  setSetting: <TKey extends keyof IAvailableSettings[T]>(
    key: keyof IAvailableSettings[T],
    value: NonNullable<ISettingsFor<T>[TKey]>,
    directory?: string
  ) => Promise<void>;
  getSettings: (directory?: string) => Promise<ISettingsFor<T>>;
}

export type Executor<T extends NcliCommand> = (
  params: IExecutorParams<T>
) => Promise<void>;

export async function commandBase<T extends NcliCommand = any>(
  executor: Executor<T>
): Promise<void> {
  const workingDirectory = process.cwd();
  const commandExecuted = path.parse(process.argv[1]).name as NcliCommand;

  try {
    const settings = await getSettings();
    const commandSettings = await getAggregatedCommandSettings(
      commandExecuted,
      settings
    );

    await executor({
      workingDirectory,
      settings: commandSettings as ISettingsFor<T>,
      setSetting: async (key, value, directory) => {
        await updateSetting(commandExecuted, {
          key: key as string,
          // The types for the function will protect from sending in
          // incorrect values here. But the types used in higher level
          // code conflicts with the lower level code, thus we need to
          // cast it here.
          value: value as SettingValue,
          scope: 'workingDirectory',
          workingDirectory: directory ?? workingDirectory
        });
      },
      getSettings: async (directory) => {
        const retrievedSettings = await getAggregatedCommandSettings(
          commandExecuted,
          settings,
          directory
        );

        return retrievedSettings as ISettingsFor<T>;
      }
    });
  } catch (err) {
    if (err instanceof CmdError) {
      ConsoleInterface.printLine(err.processMessage, Type.error);
    } else {
      ConsoleInterface.printLine((err as any).toString(), Type.error);
    }

    process.exit(1);
  }
}
