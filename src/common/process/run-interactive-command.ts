import process from 'node:process';
import { execa } from 'execa';
import { shellQuote } from './shell-quote.ts';

export type InteractiveSpawn = {
  file: string;
  args: readonly string[];
};

export const buildInteractiveShellCommand = (
  shellCommand: string,
  workingDirectory: string
): string => `cd ${shellQuote(workingDirectory)} && ${shellCommand}`;

export const getInteractiveSpawn = (
  shellCommand: string,
  workingDirectory: string
): InteractiveSpawn => {
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
