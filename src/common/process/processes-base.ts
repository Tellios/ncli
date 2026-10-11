import {PassThrough} from 'node:stream';
import {cyan, yellow, bold} from 'chalk';
import type execa from 'execa';
import {ConsoleInterface} from '../console/index.ts';
import {type ProcessRunOptions, type Process} from './process.ts';

type ActiveProcess = {
  process: Process;
  closeStream: () => void;
  promise: Promise<execa.ExecaReturnValue>;
};

export abstract class ProcessesBase {
  private activeProcesses: ActiveProcess[] = [];
  private isExiting = false;

  abstract run(options: ProcessRunOptions): Promise<execa.ExecaReturnValue[]>;

  async exit(): Promise<void> {
    this.isExiting = true;

    for await (const activeProcess of this.activeProcesses) {
      ConsoleInterface.printLine(
        `${this.getProcessPrefix(activeProcess.process)} ${yellow(
          'Stopping process',
        )}`,
      );

      await activeProcess.process.exit();
      activeProcess.closeStream();
    }

    this.activeProcesses = [];
    this.isExiting = false;
  }

  filterStreams(scriptNames: string[]): void {
    for (const {process} of this.activeProcesses) {
      if (scriptNames.length === 0) {
        process.resumeOutput();
      } else if (scriptNames.includes(process.options.name)) {
        process.resumeOutput();
      } else {
        process.pauseOutput();
      }
    }
  }

  protected async runProcess(
    process: Process,
    {stdout}: ProcessRunOptions,
  ): Promise<execa.ExecaReturnValue | undefined> {
    if (this.isExiting) {
      return;
    }

    if (process.options.interactive) {
      const activeProcess: ActiveProcess = {
        process,
        closeStream: () => undefined,
        promise: process.run({}).finally(() => {
          this.activeProcesses = this.activeProcesses.filter(
            (activeProcess) => activeProcess.process !== process,
          );
        }),
      };

      this.activeProcesses.push(activeProcess);

      return activeProcess.promise;
    }

    const onData = (data: Buffer) => {
      stdout?.write(
        `${this.getProcessPrefix(process)} ${data.toString('utf-8')}`,
      );
    };

    const stream = new PassThrough();
    stream.on('data', onData);

    const closeStream = () => {
      stream.off('data', onData);
      stream.destroy();
    };

    const activeProcess: ActiveProcess = {
      process,
      closeStream,
      promise: process.run({stdout: stream}).finally(() => {
        closeStream();
        this.activeProcesses = this.activeProcesses.filter(
          (activeProcess) => activeProcess.process !== process,
        );
      }),
    };

    this.activeProcesses.push(activeProcess);

    return activeProcess.promise;
  }

  protected getProcessPrefix(process: Process): string {
    return [
      bold(yellow('[')),
      bold(cyan(process.options.name)),
      bold(yellow(']')),
    ].join('');
  }
}
