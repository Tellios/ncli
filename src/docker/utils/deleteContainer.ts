import {runCmdInConsole} from '../../common/index.ts';

export const deleteContainer = async (
  force: boolean,
  containerId: string,
): Promise<void> => {
  const args = ['rm'];

  if (force) {
    args.push('-f');
  }

  args.push(containerId);

  return runCmdInConsole('docker', args);
};
