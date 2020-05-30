import { runCmdInConsole } from '../../common';

export const logContainer = async (
  containerId: string,
  follow: boolean
): Promise<void> => {
  const args = ['logs'];
  follow && args.push('-f');
  args.push(containerId);

  await runCmdInConsole('docker', args);
};
