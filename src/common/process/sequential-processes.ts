import {
  type ProcessOptions,
  type ProcessRunOptions,
  Process,
  type ProcessResult
} from './process.ts';
import { ProcessesBase } from './processes-base.ts';

export class SequentialProcesses extends ProcessesBase {
  protected readonly processes: readonly Process[];

  constructor(private readonly processOptions: ProcessOptions[]) {
    super();
    this.processes = this.processOptions.map((options) => new Process(options));
  }

  async run(options: ProcessRunOptions): Promise<ProcessResult[]> {
    const responses: ProcessResult[] = [];

    for (const process of this.processes) {
      const result = await this.runProcess(process, options);

      if (!result) {
        continue;
      }

      if (result.failed) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw result;
      }

      responses.push(result);
    }

    return responses;
  }
}
