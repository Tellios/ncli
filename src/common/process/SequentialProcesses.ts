import { IProcessOptions, IProcessRunOptions, Process } from './Process';
import * as execa from 'execa';
import { ProcessesBase } from './ProcessesBase';

export class SequentialProcesses extends ProcessesBase {
  protected readonly processes: ReadonlyArray<Process>;

  constructor(private readonly processOptions: IProcessOptions[]) {
    super();
    this.processes = this.processOptions.map((options) => new Process(options));
  }

  async run(
    options: IProcessRunOptions
  ): Promise<execa.ExecaReturnValue<string>[]> {
    const responses: execa.ExecaReturnValue<string>[] = [];

    for await (const process of this.processes) {
      const result = await this.runProcess(process, options);
      result && responses.push(result);
    }

    return responses;
  }
}
