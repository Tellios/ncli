import * as execa from 'execa';
import { shellQuote } from './shellQuote';

export interface IInteractiveSpawn {
  file: string;
  args: readonly string[];
}

export const buildInteractiveShellCommand = (
  shellCommand: string,
  workingDirectory: string
): string => {
  return `cd ${shellQuote(workingDirectory)} && ${shellCommand}`;
};

export const getInteractiveSpawn = (
  shellCommand: string,
  workingDirectory: string
): IInteractiveSpawn => {
  const command = buildInteractiveShellCommand(shellCommand, workingDirectory);

  if (process.platform === 'darwin') {
    return {
      file: 'script',
      args: ['-q', '/dev/null', 'sh', '-ec', command]
    };
  }

  if (process.platform === 'linux') {
    return {
      file: 'script',
      args: ['-q', '-c', command, '/dev/null']
    };
  }

  return {
    file: 'sh',
    args: ['-ec', command]
  };
};

export const canUseScriptPty = async (): Promise<boolean> => {
  if (process.platform === 'win32') {
    return false;
  }

  try {
    await execa('which', ['script']);
    return true;
  } catch {
    return false;
  }
};
