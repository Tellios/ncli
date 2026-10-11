import {runCmdInConsole} from '../../common/index.ts';

export const checkout = async (reference: string): Promise<void> =>
  runCmdInConsole('git', ['checkout', reference]);
