import {type ContainerStatus} from './ContainerStatus.ts';

export type IDockerContainer = {
  containerId: string;
  names: string;
  image: string;
  command: string;
  created: string;
  status: string;
  ports: string | undefined;
  properties: {
    Id: string;
    Created: string;
    Path: string;
    Args: string[];
    State: IDockerContainerState;
  };
};

export type IDockerContainerState = {
  Status: ContainerStatus;
  Running: boolean;
  Paused: boolean;
  Restarting: boolean;
  OOMKilled: boolean;
  Dead: boolean;
  Pid: number;
  ExitCode: number;
  Error: string;
  StartedAt: string;
  FinishedAt: string;
};
