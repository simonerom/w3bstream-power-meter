import { JSON } from "@w3bstream/wasm-sdk";

export function getPayloadValue(message: string): JSON.Obj {
  return JSON.parse(message) as JSON.Obj;
}

export function getField<T extends JSON.Value>(
  data: JSON.Obj,
  field: string
): T | null {
  return data.get(field) as T;
}
