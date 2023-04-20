import { Log, GetDataByRID, JSON } from "@w3bstream/wasm-sdk";

export { alloc } from "@w3bstream/wasm-sdk";

import { mintRewards } from "./rewards/mint-rewards";

const RECIPIENT_ADDR = "0x36f075ef0437b5fe95a7d0293823f1e085416ddf";
const TOKEN_CONTRACT_ADDR = "0x0da8d9FBb86120f74af886265c51b98B1BeAE395";

// W3bstream handler
export function start(rid: i32): i32 {
  logOnCall();

  const payload = getPayload(rid);
  const data = extractDataFromPayload(payload);

  const device_pub_key = getPublicKey(payload);
  const reading = getSensorReading(data);
  const timestamp = getTimestamp(data);

  if (validateMessage(device_pub_key, reading, timestamp) == 1) {
    return 1;
  }

  evaluateConsumtionAndMintRewards(reading!);

  return 0;
}

function getMessage(rid: i32): string {
  const deviceMessage = GetDataByRID(rid);
  Log("device message: " + deviceMessage);

  return deviceMessage;
}

function logOnCall(): void {
  Log("start() called");
  Log("TokenContractAddress: " + TOKEN_CONTRACT_ADDR);
}

function getPayload(rid: i32): JSON.Obj {
  const message = getMessage(rid);
  return JSON.parse(message) as JSON.Obj;
}

function extractDataFromPayload(payload: JSON.Obj): JSON.Obj {
  const data = payload.getObj("data") as JSON.Obj;
  Log("data: " + data.toString());

  return data;
}

function getSensorReading(data: JSON.Obj): JSON.Float | null {
  return data.getFloat("sensor_reading");
}

function getTimestamp(data: JSON.Obj): JSON.Integer | null {
  return data.getInteger("timestamp");
}

function getPublicKey(payload: JSON.Obj): JSON.Str | null {
  return payload.getString("public_key");
}

function validatePubKey(pubKey: JSON.Str | null): i32 {
  if (pubKey == null) {
    Log("Missing device public key, ignoring this data point.");
    return 1;
  }
  let pubKeyValue: string = pubKey.valueOf();
  Log("device_pub_key: " + pubKeyValue);

  return 0;
}

function validateReading(reading: JSON.Float | null): i32 {
  if (reading == null) {
    Log("sensor reading is null, ignoring this data point.");
    return 1;
  }
  return 0;
}

function validateTimestamp(timestamp: JSON.Integer | null): i32 {
  if (timestamp == null) {
    Log("timestamp is null, ignoring this data point.");
    return 1;
  }
  return 0;
}

function validateMessage(
  pubKey: JSON.Str | null,
  reading: JSON.Float | null,
  timestamp: JSON.Integer | null
): i32 {
  if (
    validatePubKey(pubKey) == 1 ||
    validateReading(reading) == 1 ||
    validateTimestamp(timestamp) == 1
  ) {
    return 1;
  }
  return 0;
}

function evaluateConsumtionAndMintRewards(reading: JSON.Float): void {
  const readingValue: f64 = reading.valueOf();
  let tokenAmount: string = "0";

  if (readingValue <= 2) {
    tokenAmount = "10";
  } else if (readingValue <= 5) {
    tokenAmount = "5";
  } else {
    Log("Consumption too high, no rewards deserved.");
    return;
  }

  mintRewards(TOKEN_CONTRACT_ADDR, RECIPIENT_ADDR, tokenAmount);
}
