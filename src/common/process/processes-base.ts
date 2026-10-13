import { PassThrough } from 'node:stream';
import { styleText } from 'node:util';
import { ConsoleInterface } from '../console/index.ts';
import {
  type Process,
  type ProcessResult,
  type ProcessRunOptions
} from './process.ts';

type ActiveProcess = {
  process: Process;
  closeStream: () => void;
  promise: Promise<ProcessResult>;
};

export abstract class ProcessesBase {
  private activeProcesses: ActiveProcess[] = [];
  private isExiting = false;

  abstract run(options: ProcessRunOptions): Promise<ProcessResult[]>;

  async exit(): Promise<void> {
    this.isExiting = true;

    for (const activeProcess of this.activeProcesses) {
      ConsoleInterface.printLine(
        `${this.getProcessPrefix(activeProcess.process)} ${styleText(
          'yellow',
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
    for (const { process } of this.activeProcesses) {
      if (
        scriptNames.length === 0 ||
        scriptNames.includes(process.options.name)
      ) {
        process.resumeOutput();
      } else {
        process.pauseOutput();
      }
    }
  }

  protected async runProcess(
    process: Process,
    { stdout }: ProcessRunOptions
  ): Promise<ProcessResult | undefined> {
    if (this.isExiting) {
      return;
    }

    if (process.options.interactive) {
      const activeProcess: ActiveProcess = {
        process,
        closeStream: () => undefined,
        promise: process.run({}).finally(() => {
          this.activeProcesses = this.activeProcesses.filter(
            (p) => p.process !== process
          );
        })
      };

      this.activeProcesses.push(activeProcess);

      return activeProcess.promise;
    }

    const onData = (data: Buffer) => {
      stdout?.write(
        `${this.getProcessPrefix(process)} ${data.toString('utf8')}`
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
      promise: process.run({ stdout: stream }).finally(() => {
        closeStream();
        this.activeProcesses = this.activeProcesses.filter(
          (p) => p.process !== process
        );
      })
    };

    this.activeProcesses.push(activeProcess);

    return activeProcess.promise;
  }

  protected getProcessPrefix(process: Process): string {
    return [
      styleText(['bold', 'yellow'], '['),
      styleText(['bold', 'cyan'], process.options.name),
      styleText(['bold', 'yellow'], ']')
    ].join('');
  }
}
