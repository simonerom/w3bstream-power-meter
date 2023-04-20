import { JSON } from "@w3bstream/wasm-sdk";
import { getPayloadValue, getField } from "../payload-parser";

const DEVICE_MESSAGE =
  '{"data":{"sensor_reading":1.6163222834016864,"timestamp":1681943510756},"public_key":"040e2d0a3591eb27ad3b55038603c3813310fdaf0f15346016a576841790fb020756cd31af40e3c6d543fb332062d47dd717490f2cc28d053c63de3ae892ec091b","signature":"3045022025891d5d149de8ad612f71687f6e4a9a13335d5cb35c0e6f54237ea8715084c8022100cf2e3bf7304ddf417dc75d52f0403013901a146636203ad138adb8ea3750b85f"}';
const DEVICE_MESSAGE_2 =
  '{"public_key":"040e2d0a3591eb27ad3b55038603c3813310fdaf0f15346016a576841790fb020756cd31af40e3c6d543fb332062d47dd717490f2cc28d053c63de3ae892ec091b","signature":"3045022025891d5d149de8ad612f71687f6e4a9a13335d5cb35c0e6f54237ea8715084c8022100cf2e3bf7304ddf417dc75d52f0403013901a146636203ad138adb8ea3750b85f"}';

test("Payload parser", () => {
  describe("Parse message", () => {
    it("should extract payload from message", () => {
      const payload = getPayloadValue(DEVICE_MESSAGE);

      expect(payload.has("data")).toBe(true);
      expect(payload.has("public_key")).toBe(true);
      expect(payload.has("signature")).toBe(true);
    });
    itThrows("should throw error if message is not a valid JSON", () => {
      const invalidMessage = "invalid message";
      getPayloadValue(invalidMessage);
    });
  });
  describe("Extract data from payload", () => {
    it("should extract data from payload", () => {
      const payload = getPayloadValue(DEVICE_MESSAGE);
      const data = getField<JSON.Obj>(payload, "data");

      expect(data!.has("sensor_reading")).toBe(true);
      expect(data!.has("timestamp")).toBe(true);
    });
    itThrows("should throw error if there is no data", () => {
      const invalidPayload = getPayloadValue(DEVICE_MESSAGE_2);
      getField<JSON.Obj>(invalidPayload, "data");
    });
  });
  describe("Extract sensor reading from data", () => {
    it("should extract sensor reading from data", () => {
      const payload = getPayloadValue(DEVICE_MESSAGE);
      const data = getField<JSON.Obj>(payload, "data");

      const sensorReading = getField<JSON.Float>(data!, "sensor_reading");
      expect(sensorReading!.isFloat).toBe(true);
    });
    itThrows("should throw error if there is no sensor reading", () => {
      const invalidPayload = getPayloadValue(DEVICE_MESSAGE_2);
      const data = getField<JSON.Obj>(invalidPayload, "data");

      getField<JSON.Float>(data!, "sensor_reading");
    });
  });
  describe("Extract timestamp from data", () => {
    it("should extract timestamp from data", () => {
      const payload = getPayloadValue(DEVICE_MESSAGE);
      const data = getField<JSON.Obj>(payload, "data");

      const timestamp = getField<JSON.Integer>(data!, "timestamp");
      expect(timestamp!.isInteger).toBe(true);
    });
    itThrows("should throw error if there is no timestamp", () => {
      const invalidPayload = getPayloadValue(DEVICE_MESSAGE_2);
      const data = getField<JSON.Obj>(invalidPayload, "data");

      getField<JSON.Integer>(data!, "timestamp");
    });
  });
});
