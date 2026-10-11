import {type DockerContainer} from './docker-container.interface.ts';
import {containerStatusColoring} from './container-status-coloring.ts';

export const getDockerContainersStatusRows = (
  containers: DockerContainer[],
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
