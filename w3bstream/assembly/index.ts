import { Log, GetDataByRID, GetEnv, SendTx, JSON } from "@w3bstream/wasm-sdk";
import { Int32 } from "@w3bstream/wasm-sdk/assembly/sql";
export { alloc } from "@w3bstream/wasm-sdk";

function mintRewards(
  tokenContract: string,
  recipient: string,
  amountHexStr: string
): void {
  const amountStr = "0".repeat(64 - amountHexStr.length) + amountHexStr;
  const recipientStr = recipient.replace("0x","");
  const data: string = `0x40c10f19000000000000000000000000${recipientStr}${amountStr}`;
  Log("Sending tx data: "+ data);
  const res = SendTx(
    4690,
    tokenContract,
    "0",
    `0x40c10f19000000000000000000000000${recipientStr}${amountStr}`
  );
  Log("Send tx result:" + res);
}

// W3bstream handler
export function start(rid: i32): i32 {
  Log("start function called");
  let payloadStr = GetDataByRID(rid);
  Log("payload: " + payloadStr);

  const TokenContractAddress = GetEnv("TokenContractAddress");
  Log("TokenContractAddress: " + TokenContractAddress);

  const RecipientAddress = GetEnv("RecipientAddress");
  Log("RecipientAddress: " + RecipientAddress);

  let payload: JSON.Obj = JSON.parse(payloadStr) as JSON.Obj;
  let data: JSON.Obj = payload.getObj("data") as JSON.Obj;
  const reading: JSON.Float | null = data.getFloat("sensor_reading");
  const timestamp: JSON.Integer | null = data.getInteger("timestamp");

  if (reading == null) {
    Log("sensor reading is null, ignoring this data point.");
    return 1;
  } else if (timestamp == null) {
    Log("timestamp is null, ignoring this data point.");
    return 1;
  }

  let readingValue = reading.valueOf();
  let timestampValue = timestamp.valueOf();

  Log("sensor reading: " + readingValue.toString());
  Log("timestamp: " + timestampValue.toString());

  // If using less than 2Wh, mint 1 token to the recipient
  if (readingValue <= 2) {
    Log("Minting 10 token to recipient...");
    mintRewards(TokenContractAddress, RecipientAddress, "8AC7230489E80000");
  } else if (readingValue <= 5){
    Log("Minting 4 token to recipient...");
    mintRewards(TokenContractAddress, RecipientAddress, "3782DACE9D900000");
  } else {
    Log("Consumption too high, no rewards deserved.")
  }
    return 0;
}

export function abort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void {
  if (message == null) message = "unknown error";
  if (fileName == null) fileName = "unknown file";
  Log(
    "ABORT: " +
      message +
      " at " +
      fileName +
      ":" +
      lineNumber.toString() +
      ":" +
      columnNumber.toString()
  );
}
