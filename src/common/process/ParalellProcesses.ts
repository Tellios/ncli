import { Writable } from 'stream';
import { IProcessOptions, IProcessRunOptions, Process } from './Process';

export class ParalellProcesses {
  async run(
    processOptions: IProcessOptions[],
    runOptions: IProcessRunOptions
  ): Promise<unknown> {
    const processes = processOptions.map((options) => new Process(options));

    const instances = processes.map((process) => {
      const stream = new Writable();
      // runOptions.stdout && stream.pipe(runOptions.stdout);

      return process.run({ stdout: stream });
    });

    return await Promise.all(instances);
  }
}
