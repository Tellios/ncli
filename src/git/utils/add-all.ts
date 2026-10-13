import { runCmdInConsole } from '../../common/index.ts';

export const addAll = async (repositoryPath: string): Promise<void> =>
  runCmdInConsole('git', ['add', '.'], true, repositoryPath);
