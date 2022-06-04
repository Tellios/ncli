import { ISettingDescription } from './ISettingDescription';
import { NcliCommand } from './NcliCommand';
import { IAvailableSettings } from './availableSettings';
import { SettingType } from './SettingType';

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
  S extends { [key: string]: ISettingDescription<SettingType> }
> = { [key in keyof S]: InferredSettingsValue<S[key]> };

export type ISettingsFor<TCommand extends NcliCommand> = Partial<
  InferredSettingsValues<IAvailableSettings[TCommand]>
>;
