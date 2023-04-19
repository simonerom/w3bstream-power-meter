export function ethToWei(eth: string): string {
  const floatValue = stringToFloat(eth);
  const floatWei = toPow18(floatValue);
  return floatWeiToString(floatWei);
}

export function stringToFloat(value: string): f64 {
  const valueFloat = parseFloat(value);

  if (isNaN(valueFloat)) {
    throw new Error("Value is not a number");
  }

  return valueFloat;
}

function toPow18(value: f64): f64 {
  for (let i = 0; i < 18; i++) {
    value *= 10;
  }
  return value;
}

function floatWeiToString(value: f64): string {
  const stringified = value.toString();
  return stringified.split(".")[0];
}
