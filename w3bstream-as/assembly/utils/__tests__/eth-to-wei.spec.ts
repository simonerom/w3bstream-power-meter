import { ethToWei } from "../eth-to-wei";

test("Test utils", () => {
  describe("parseEth", () => {
    it("should parse eth with whole numbers", () => {
      expect<string>(ethToWei("1")).toBe("1000000000000000000");
      expect<string>(ethToWei("10")).toBe("10000000000000000000");
      expect<string>(ethToWei("18")).toBe("18000000000000000000");
      expect<string>(ethToWei("100")).toBe("100000000000000000000");
      expect<string>(ethToWei("200")).toBe("200000000000000000000");
      expect<string>(ethToWei("999")).toBe("999000000000000000000");
    });
    it("should parse eth with decimals", () => {
      expect<string>(ethToWei("0.1")).toBe("100000000000000000");
      expect<string>(ethToWei("0.04")).toBe("40000000000000000");
      expect<string>(ethToWei("0.01")).toBe("10000000000000000");
      expect<string>(ethToWei("0.001")).toBe("1000000000000000");
      expect<string>(ethToWei("0.0001")).toBe("100000000000000");
      expect<string>(ethToWei("0.00001")).toBe("10000000000000");
    });
    it("should parse eth with decimals and whole numbers", () => {
      expect<string>(ethToWei("1.1")).toBe("1100000000000000000");
      expect<string>(ethToWei("1.01")).toBe("1010000000000000000");
      expect<string>(ethToWei("1.0001")).toBe("1000100000000000000");
      expect<string>(ethToWei("1.00001")).toBe("1000010000000000000");
    });
    xit("should parse with high precision", () => {
      expect<string>(ethToWei("1.001")).toBe("1001000000000000000");
    });
    itThrows(
      "should throw if value is not a number",
      () => {
        ethToWei("a");
      },
      "Value is not a number"
    );
    itThrows(
      "should throw if value is empty",
      () => {
        ethToWei("");
      },
      "Value is not a number"
    );
  });
});
