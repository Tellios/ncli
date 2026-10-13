import type { ExecaReturnValue, ExecaReturnBase } from 'execa';
import {
  type ProcessOptions,
  type ProcessRunOptions,
  Process
} from './process.ts';
import { ProcessesBase } from './processes-base.ts';

export class ParallelProcesses extends ProcessesBase {
  protected readonly processes: readonly Process[];

  constructor(private readonly processOptions: ProcessOptions[]) {
    super();
    this.processes = this.processOptions.map((options) => new Process(options));
  }

  async run(
    options: ProcessRunOptions
  ): Promise<Array<ExecaReturnValue | ExecaReturnBase<string>>> {
    const results: Array<ExecaReturnValue | ExecaReturnBase<string>> = [];

    const instances = this.processes.map(async (process) => {
      const result = await this.runProcess(process, options);
      result && results.push(result);
    });

    await Promise.allSettled(instances);

    return results;
  }
}
