import { runCmdInConsole } from '../../common/index.ts';

export const logContainer = async (
  containerId: string,
  follow: boolean
): Promise<void> => {
  const args = ['logs', ...(follow ? ['-f'] : []), containerId];
  await runCmdInConsole('docker', args);
};
