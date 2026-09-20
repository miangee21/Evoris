//src/shared/types/ipc.types.ts
export interface IpcResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

export type BasePayload = Record<string, unknown>;
