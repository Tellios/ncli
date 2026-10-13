import { runCmdInConsole } from '../../common/index.ts';

export const deleteContainer = async (
  force: boolean,
  containerId: string
): Promise<void> => {
  let args = ['rm'];

  if (force) {
    args = [...args, '-f'];
  }

  args.push(containerId);

  return runCmdInConsole('docker', args);
};
