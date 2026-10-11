import {type SettingDescription} from './setting-description.interface.ts';
import {type NcliCommand} from './ncli-command.ts';
import {type AvailableSettings} from './available-settings.ts';
import {type SettingType} from './setting-type.ts';

type InferredSettingsValue<S extends SettingDescription<SettingType>> =
  S extends {
    type: 'boolean';
  }
    ? boolean
    : S extends {
          type: 'string';
        }
      ? string
      : unknown;

type InferredSettingsValues<
  S extends Record<string, SettingDescription<SettingType>>,
> = {[key in keyof S]: InferredSettingsValue<S[key]>};

export type SettingsFor<TCommand extends NcliCommand> = Partial<
  InferredSettingsValues<AvailableSettings[TCommand]>
>;
