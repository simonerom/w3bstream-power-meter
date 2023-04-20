import { Log, SendTx } from "@w3bstream/wasm-sdk";

import { buildTxData } from "../utils/build-tx";

const FUNCTION_ADDR = "40c10f19";

export function mintRewards(
  tokenContract: string,
  recipient: string,
  tokenAmount: string
): void {
  const data = buildTxData(FUNCTION_ADDR, recipient, tokenAmount);

  Log(`Minting ${tokenAmount} token to ${recipient}`);
  const res = SendTx(4690, tokenContract, "0", data);
  Log("Send tx result:" + res);
}
