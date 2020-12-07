export enum StatusType {
  Error = 'error',
  Loading = 'loading',
  Success = 'success',
}

export interface Status {
  type: StatusType;
  message: string;
  id?: number;
  timeout?: number;
}

export interface InternalStatus extends Status {
  id: number;
  createdAt: number;
  timeout: number;
  visible: true;
}

export const defaultTimeouts: Map<StatusType, number> = new Map([
  [StatusType.Error, 4000],
  [StatusType.Success, 1500],
  [StatusType.Loading, 30000],
]);
