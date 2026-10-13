import cp from 'node:child_process';

export const getCmdResult = async (
  cmd: string,
  args: string[],
  cwd?: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    cp.exec(
      [cmd, ...args].join(' '),
      {
        cwd
      },
      (error, stdout) => {
        if (error) {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(error);
          return;
        }

        resolve(stdout);
      }
    );
  });
