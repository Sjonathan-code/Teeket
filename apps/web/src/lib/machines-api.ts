import { apiFetch } from './api-client';

export type MachineStatus = 'ONLINE' | 'OFFLINE' | 'WARNING' | 'UNKNOWN';

export interface Machine {
  id: string;
  hostname: string;
  serialNumber: string | null;
  operatingSystem: string | null;
  agentVersion: string | null;
  status: MachineStatus;
  lastSeenAt: string | null;
}

export const machinesApi = {
  list: (): Promise<Machine[]> => apiFetch('/machines'),
};

export const machineStatusLabels: Record<MachineStatus, string> = {
  ONLINE: 'En ligne',
  OFFLINE: 'Hors ligne',
  WARNING: 'Attention',
  UNKNOWN: 'Inconnu',
};

export const machineStatusStyles: Record<MachineStatus, string> = {
  ONLINE: 'bg-emerald-50 text-emerald-700',
  OFFLINE: 'bg-slate-100 text-slate-600',
  WARNING: 'bg-amber-50 text-amber-700',
  UNKNOWN: 'bg-blue-50 text-blue-700',
};
