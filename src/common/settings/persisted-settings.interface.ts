import { type NcliCommand } from './ncli-command.ts';
import { type PersistedSetting } from './persisted-setting.interface.ts';

export type PersistedSettings = Partial<
  Record<NcliCommand, PersistedSetting[]>
>;
