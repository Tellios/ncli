import { runCmdInConsole } from '../../common/index.ts';

export const stopContainer = async (containerId: string): Promise<void> =>
  runCmdInConsole('docker', ['stop', containerId]);
