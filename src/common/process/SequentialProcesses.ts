import type execa from 'execa';
import {
  type IProcessOptions,
  type IProcessRunOptions,
  Process,
} from './Process.ts';
import {ProcessesBase} from './ProcessesBase.ts';

export class SequentialProcesses extends ProcessesBase {
  protected readonly processes: readonly Process[];

  constructor(private readonly processOptions: IProcessOptions[]) {
    super();
    this.processes = this.processOptions.map((options) => new Process(options));
  }

  async run(options: IProcessRunOptions): Promise<execa.ExecaReturnValue[]> {
    const responses: execa.ExecaReturnValue[] = [];

    for await (const process of this.processes) {
      const result = await this.runProcess(process, options);

      if (!result) {
        continue;
      }

      if (result.failed) {
        throw result;
      }

      responses.push(result);
    }

    return responses;
  }
}
