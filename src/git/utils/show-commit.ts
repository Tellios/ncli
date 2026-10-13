import { runCmdInConsole } from '../../common/index.ts';

export const showCommit = async (
  workingDirectory: string,
  commitId: string
) => {
  await runCmdInConsole(
    'git',
    ['show', commitId, '--stat'],
    true,
    workingDirectory
  );
};
