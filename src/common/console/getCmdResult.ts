import cp from 'node:child_process';

export const getCmdResult = async (
  cmd: string,
  args: string[],
  cwd?: string,
): Promise<string> =>
  new Promise((resolve, reject) => {
    cp.exec(
      [cmd, ...args].join(' '),
      {
        cwd,
      },
      (error: cp.ExecException | undefined, stdout: string) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(stdout);
      },
    );
  });
