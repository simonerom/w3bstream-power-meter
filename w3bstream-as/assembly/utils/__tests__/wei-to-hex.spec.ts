import { weiToTxSlot, tokenNumberToHex } from "../wei-to-hex";

test("Test utils", () => {
  describe("weiToHex", () => {
    it("should convert wei to hex", () => {
      expect<string>(weiToTxSlot("1")).toBe(
        "0000000000000000000000000000000000000000000000000000000000000001"
      );
      expect<string>(weiToTxSlot("10000000000000000000")).toBe(
        "0000000000000000000000000000000000000000000000008ac7230489e80000"
      );
      expect<string>(weiToTxSlot("4000000000000000000")).toBe(
        "0000000000000000000000000000000000000000000000003782dace9d900000"
      );
    });
  });
  describe("tokenNumberToHex", () => {
    it("should convert token number to hex", () => {
      expect<string>(tokenNumberToHex("10")).toBe(
        "0000000000000000000000000000000000000000000000008ac7230489e80000"
      );
      expect<string>(tokenNumberToHex("4")).toBe(
        "0000000000000000000000000000000000000000000000003782dace9d900000"
      );
    });
  });
});
