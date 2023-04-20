import { Log, GetDataByRID, JSON } from "@w3bstream/wasm-sdk";

export { alloc } from "@w3bstream/wasm-sdk";

import { mintRewards } from "./rewards/mint-rewards";
import { getField, getPayloadValue } from "./utils/payload-parser";
import { validateMessage } from "./utils/message-validation";

const RECIPIENT_ADDR = "0x36f075ef0437b5fe95a7d0293823f1e085416ddf";
const TOKEN_CONTRACT_ADDR = "0x0da8d9FBb86120f74af886265c51b98B1BeAE395";

// W3bstream handler
export function start(rid: i32): i32 {
  logOnCall();

  const message = getMessage(rid);
  validateMessage(message);

  // message verification
  // message processing

  const reading = getReading(message);
  evaluateConsumtionAndMintRewards(reading);

  return 0;
}

function logOnCall(): void {
  Log("start() called");
  Log("TokenContractAddress: " + TOKEN_CONTRACT_ADDR);
}

function getMessage(rid: i32): string {
  const deviceMessage = GetDataByRID(rid);
  Log("device message: " + deviceMessage);

  return deviceMessage;
}

function getReading(message: string): JSON.Float {
  const payload = getPayloadValue(message);
  const data = getField<JSON.Obj>(payload, "data");
  const reading = getField<JSON.Float>(data!, "sensor_reading");

  return reading!;
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
