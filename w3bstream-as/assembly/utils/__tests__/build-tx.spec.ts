import { buildTxData } from "../build-tx";

const TX_DATA =
  "0x40c10f1900000000000000000000000036f075ef0437b5fe95a7d0293823f1e085416ddf0000000000000000000000000000000000000000000000003782dace9d900000";
const RECIPIENT_ADDR = "0x36f075ef0437b5fe95a7d0293823f1e085416ddf";
const FUNCTION_ADDR = "40c10f19";

test("Transaction data builder", () => {
  it("should build a transaction data string", () => {
    expect<string>(buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, "4")).toBe(
      TX_DATA
    );
  });
});
