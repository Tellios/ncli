import { runCmdInConsole } from '../../common/index.ts';

export const showResourceLogs = async (
  follow: boolean,
  resourceName: string,
  containerName: string
): Promise<void> => {
  const args = [
    'logs',
    ...(follow ? ['-f'] : []),
    resourceName,
    '--container',
    containerName
  ];

  await runCmdInConsole('kubectl', args);
};
