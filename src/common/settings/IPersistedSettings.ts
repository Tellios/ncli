import {type NcliCommand} from './NcliCommand.ts';
import {type IPersistedSetting} from './IPersistedSetting.ts';

export type IPersistedSettings = Partial<
  Record<NcliCommand, IPersistedSetting[]>
>;
