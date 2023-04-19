import { ethToWei, stringToFloat } from "./eth-to-wei";

export function tokenNumberToHex(value: string): string {
  const weiStr = ethToWei(value);
  return weiToTxSlot(weiStr);
}

export function weiToTxSlot(value: string): string {
  const valueFloat = stringToFloat(value);
  const valueInt = valueFloat as u64;
  const hexStr = intToHexStr(valueInt);
  return composeAmountStr(hexStr);
}

export function composeAmountStr(amountHexStr: string): string {
  return "0".repeat(64 - amountHexStr.length) + amountHexStr;
}

export function intToHexStr(value: u64): string {
  return value.toString(16);
}
