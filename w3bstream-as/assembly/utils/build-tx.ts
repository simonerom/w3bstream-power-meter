import { tokenNumberToHex } from "./wei-to-hex";

export function buildTxData(
  functionAddr: string,
  recipient: string,
  tokenAmount: string
): string {
  const slotForRecipient = buildRecepientSlot(recipient);
  const slotForAmount = tokenNumberToHex(tokenAmount);

  return buildTxString([functionAddr, slotForRecipient, slotForAmount]);
}

function buildRecepientSlot(recipient: string): string {
  return `000000000000000000000000${formatAddress(recipient)}`;
}

function formatAddress(address: string): string {
  return address.replace("0x", "");
}

function buildTxString(args: string[]): string {
  return "0x" + args.join("");
}
