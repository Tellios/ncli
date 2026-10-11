import {type ISettingDescription} from './ISettingDescription.ts';
import {type NcliCommand} from './NcliCommand.ts';
import {type IAvailableSettings} from './availableSettings.ts';
import {type SettingType} from './SettingType.ts';

type InferredSettingsValue<S extends ISettingDescription<SettingType>> =
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
  S extends Record<string, ISettingDescription<SettingType>>,
> = {[key in keyof S]: InferredSettingsValue<S[key]>};

export type ISettingsFor<TCommand extends NcliCommand> = Partial<
  InferredSettingsValues<IAvailableSettings[TCommand]>
>;
