import { runCmdInConsole } from '../../common/index.ts';

export const pull = async (): Promise<void> => runCmdInConsole('git', ['pull']);
