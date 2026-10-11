import {
  availableSettings,
  type NcliCommand,
  type SettingDescription,
  type SettingType,
} from '../../common/index.ts';

export const supportedNcliCommands: NcliCommand[] = Object.entries(
  availableSettings,
)
  .filter(([_, settings]) =>
    Object.values(settings).some((description) => !description.hidden),
  )
  .map(([key, _]) => key) as NcliCommand[];
