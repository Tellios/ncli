import { ConsoleInterface } from '../../common/index.ts';
import { getContainers, containerStatusColoring } from '../utils/index.ts';

export type ListCommandParameters = {
  onlyShowRunning: boolean;
};

export const listCommand = async ({
  onlyShowRunning
}: ListCommandParameters): Promise<void> => {
  const processes = await getContainers(onlyShowRunning);

  const rows: string[][] = processes.map((process) => {
    const color = containerStatusColoring(process);

    const row = [
      process.names,
      process.image,
      process.status,
      process.ports || '',
      process.containerId
    ];

    return row.map((text) => color(text));
  });

  ConsoleInterface.printTable(
    ['Name', 'Image', 'Status', 'Ports', 'Container Id'],
    rows
  );
};
