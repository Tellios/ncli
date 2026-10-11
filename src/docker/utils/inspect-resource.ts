import {runCmdInConsole} from '../../common/index.ts';

export const inspectResource = async (resourceId: string): Promise<void> => {
  await runCmdInConsole('docker', ['inspect', resourceId]);
};
