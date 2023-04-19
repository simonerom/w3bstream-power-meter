import { Log, GetDataByRID, SendTx, JSON, ExecSQL } from "@w3bstream/wasm-sdk";
import { Float64, Int64, String, Time } from "@w3bstream/wasm-sdk/assembly/sql";

export { alloc } from "@w3bstream/wasm-sdk";

export function mintRewards(
  tokenContract: string,
  recipient: string,
  amountHexStr: string
): void {
  const amountStr = "0".repeat(64 - amountHexStr.length) + amountHexStr;
  const recipientStr = recipient.replace("0x", "");
  const data: string = `0x40c10f19000000000000000000000000${recipientStr}${amountStr}`;
  Log("Sending tx data: " + data);
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

  // const TokenContractAddress = GetEnv("TokenContractAddress");
  const TokenContractAddress = "0x0da8d9FBb86120f74af886265c51b98B1BeAE395";
  Log("TokenContractAddress: " + TokenContractAddress);

  //const RecipientAddress = GetEnv("RecipientAddress");
  const RecipientAddress = "0x2C37a2cBcFacCdD0625b4E3151d6260149eE866B";
  Log("RecipientAddress: " + RecipientAddress);

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

  // Insert data into database
  Log("Inserting data into database...");
  const value = ExecSQL(
    `INSERT INTO "sensor_data" (device_id,timestamp,sensor_reading) VALUES (?,?,?);`,
    [
      new String(devicePubKeyValue),
      new Time(timestampValue.toString()),
      new Int64(10000),
      new Float64(readingValue),
    ]
  );

  // If using less than 2Wh, mint 1 token to the recipient
  if (readingValue <= 2) {
    Log("Minting 10 token to recipient...");
    mintRewards(TokenContractAddress, RecipientAddress, "8AC7230489E80000");
  } else if (readingValue <= 5) {
    Log("Minting 4 token to recipient...");
    mintRewards(TokenContractAddress, RecipientAddress, "3782DACE9D900000");
  } else {
    Log("Consumption too high, no rewards deserved.");
  }
  return 0;
}
