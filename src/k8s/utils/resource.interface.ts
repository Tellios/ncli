import { type Deployment } from './deployment.interface.ts';
import { type Ingress } from './ingress.interface.ts';
import { type Pod } from './pod.interface.ts';
import { type Service } from './service.interface.ts';

export type Resource = Deployment | Ingress | Pod | Service;
