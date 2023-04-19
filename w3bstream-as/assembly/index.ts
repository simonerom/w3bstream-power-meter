import { Log, GetDataByRID, SendTx, JSON } from "@w3bstream/wasm-sdk";

export { alloc } from "@w3bstream/wasm-sdk";

import { buildTx } from "./utils/build-tx";

const FUNCTION_ADDR = "40c10f19";
const RECIPIENT_ADDR = "0x36f075ef0437b5fe95a7d0293823f1e085416ddf";
const TOKEN_CONTRACT_ADDR = "0x0da8d9FBb86120f74af886265c51b98B1BeAE395";

export function mintRewards(
  tokenContract: string,
  recipient: string,
  tokenAmount: string
): void {
  const data = buildTx(FUNCTION_ADDR, recipient, tokenAmount);
  
  const res = SendTx(4690, tokenContract, "0", data);
  Log("Send tx result:" + res);
}

// W3bstream handler
export function start(rid: i32): i32 {
  Log("start function called");

  let payloadStr = GetDataByRID(rid);
  Log("payload: " + payloadStr);

  Log("TokenContractAddress: " + TOKEN_CONTRACT_ADDR);
  Log("RecipientAddress: " + RECIPIENT_ADDR);

  let payload: JSON.Obj = JSON.parse(payloadStr) as JSON.Obj;
  let data: JSON.Obj = payload.getObj("data") as JSON.Obj;
  Log("data: " + data.toString());

  const reading: JSON.Float | null = data.getFloat("sensor_reading");
  const timestamp: JSON.Integer | null = data.getInteger("timestamp");
  const device_pub_key: JSON.Str | null = payload.getString("public_key");

  if (device_pub_key == null) {
    Log("Missing device public key, ignoring this data point.");
    return 1;
  }
  let devicePubKeyValue: string = device_pub_key.valueOf();
  Log("device_pub_key: " + devicePubKeyValue);

  if (reading == null) {
    Log("sensor reading is null, ignoring this data point.");
    return 1;
  } else if (timestamp == null) {
    Log("timestamp is null, ignoring this data point.");
    return 1;
  }

  let readingValue: f64 = reading.valueOf();
  let timestampValue: i64 = timestamp.valueOf();

  Log("sensor reading: " + readingValue.toString());
  Log("timestamp: " + timestampValue.toString());

  // If using less than 2Wh, mint 1 token to the recipient
  if (readingValue <= 2) {
    Log("Minting 10 token to recipient...");
    mintRewards(TOKEN_CONTRACT_ADDR, RECIPIENT_ADDR, "10");
  } else if (readingValue <= 5) {
    Log("Minting 4 token to recipient...");
    mintRewards(TOKEN_CONTRACT_ADDR, RECIPIENT_ADDR, "4");
  } else {
    Log("Consumption too high, no rewards deserved.");
  }
  return 0;
}
