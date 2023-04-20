import { JSON } from "@w3bstream/wasm-sdk";

import { getField, getPayloadValue } from "./payload-parser";

class MessageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessageValidationError";
  }
}

export function validateMessage(message: string): void {
  const payload = getPayloadValue(message);
  validatePayload(payload);
}

function validatePayload(payload: JSON.Obj): void {
  validateField<JSON.Str>(payload, "public_key");
  validateField<JSON.Str>(payload, "signature");

  const data = getField<JSON.Obj>(payload, "data");
  validateData(data!);
}

function validateData(data: JSON.Obj): void {
  validateField<JSON.Float>(data, "sensor_reading");
  validateField<JSON.Integer>(data, "timestamp");
}

function validateField<T extends JSON.Value>(
  data: JSON.Obj,
  field: string
): void {
  const value = getField<T>(data, field);

  if (value instanceof JSON.Str) {
    if (value.valueOf() === "") {
      throw new MessageValidationError(`Missing field ${field}`);
    }
  }

  if (value instanceof JSON.Float || value instanceof JSON.Integer) {
    if (value.valueOf() === 0) {
      throw new MessageValidationError(`Missing field ${field}`);
    }
  }
}
