import {type IDockerContainer} from './IDockerContainer.ts';
import {containerStatusColoring} from './containerStatusColoring.ts';

export const getDockerContainersStatusRows = (
  containers: IDockerContainer[],
): string[] =>
  containers.map((process) => {
    const color = containerStatusColoring(process);

    const row = [
      process.names,
      process.image,
      process.status,
      process.containerId,
    ].join(' - ');

    return color(row);
  });
