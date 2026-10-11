import process from 'node:process';
import path from 'node:path';
import {ConsoleInterface, Type, CmdError} from '../console/index.ts';
import {
  getSettings,
  getAggregatedCommandSettings,
  type NcliCommand,
  type SettingsFor,
  type AvailableSettings,
  updateSetting,
  type SettingValue,
} from '../settings/index.ts';

export type ExecutorParams<T extends NcliCommand> = {
  workingDirectory: string;
  settings: SettingsFor<T>;
  setSetting: <TKey extends keyof AvailableSettings[T]>(
    key: keyof AvailableSettings[T],
    value: NonNullable<SettingsFor<T>[TKey]>,
    directory?: string,
  ) => Promise<void>;
  getSettings: (directory?: string) => Promise<SettingsFor<T>>;
};

export type Executor<T extends NcliCommand> = (
  parameters: ExecutorParams<T>,
) => Promise<void>;

export async function commandBase<T extends NcliCommand = any>(
  executor: Executor<T>,
): Promise<void> {
  const workingDirectory = process.cwd();
  const commandExecuted = path.parse(process.argv[1]).name as NcliCommand;

  try {
    const settings = await getSettings();
    const commandSettings = await getAggregatedCommandSettings(
      commandExecuted,
      settings,
    );

    await executor({
      workingDirectory,
      settings: commandSettings as SettingsFor<T>,
      async setSetting(key, value, directory) {
        await updateSetting(commandExecuted, {
          key: key as string,
          // The types for the function will protect from sending in
          // incorrect values here. But the types used in higher level
          // code conflicts with the lower level code, thus we need to
          // cast it here.
          value: value as SettingValue,
          scope: 'workingDirectory',
          workingDirectory: directory ?? workingDirectory,
        });
      },
      async getSettings(directory) {
        const retrievedSettings = await getAggregatedCommandSettings(
          commandExecuted,
          settings,
          directory,
        );

        return retrievedSettings as SettingsFor<T>;
      },
    });
  } catch (error) {
    if (error instanceof CmdError) {
      ConsoleInterface.printLine(error.processMessage, Type.error);
    } else {
      ConsoleInterface.printLine((error as any).toString(), Type.error);
    }

    process.exit(1);
  }
}
