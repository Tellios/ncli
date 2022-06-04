import { PassThrough } from 'stream';
import { IProcessRunOptions, Process } from './Process';
import { cyan, yellow, bold } from 'chalk';
import * as execa from 'execa';
import { ConsoleInterface } from '..';

interface IActiveProcess {
  process: Process;
  closeStream: () => void;
  promise: Promise<execa.ExecaReturnValue>;
}

export abstract class ProcessesBase {
  private activeProcesses: IActiveProcess[] = [];
  private isExiting = false;

  abstract run(
    options: IProcessRunOptions
  ): Promise<execa.ExecaReturnValue<string>[]>;

  async exit(): Promise<void> {
    this.isExiting = true;

    for await (const activeProcess of this.activeProcesses) {
      ConsoleInterface.printLine(
        `${this.getProcessPrefix(activeProcess.process)} ${yellow(
          'Stopping process'
        )}`
      );

      await activeProcess.process.exit();
      activeProcess.closeStream();
    }

    this.activeProcesses = [];
    this.isExiting = false;
  }

  filterStreams(scriptNames: string[]): void {
    this.activeProcesses.forEach(({ process }) => {
      if (scriptNames.length === 0) {
        process.resumeOutput();
      } else if (scriptNames.includes(process.options.name)) {
        process.resumeOutput();
      } else {
        process.pauseOutput();
      }
    });
  }

  protected async runProcess(
    process: Process,
    { stdout }: IProcessRunOptions
  ): Promise<execa.ExecaReturnValue | undefined> {
    if (this.isExiting) {
      return;
    }

    const onData = (data: Buffer) => {
      stdout?.write(
        `${this.getProcessPrefix(process)} ${data.toString('utf-8')}`
      );
    };

    const stream = new PassThrough();
    stream.on('data', onData);

    const closeStream = () => {
      stream.off('data', onData);
      stream.destroy();
    };

    const activeProcess: IActiveProcess = {
      process,
      closeStream,
      promise: process.run({ stdout: stream }).finally(() => {
        closeStream();
        this.activeProcesses = this.activeProcesses.filter(
          (activeProcess) => activeProcess.process !== process
        );
      })
    };

    this.activeProcesses.push(activeProcess);

    return activeProcess.promise;
  }

  protected getProcessPrefix(process: Process): string {
    return [
      bold(yellow('[')),
      bold(cyan(process.options.name)),
      bold(yellow(']'))
    ].join('');
  }
}
