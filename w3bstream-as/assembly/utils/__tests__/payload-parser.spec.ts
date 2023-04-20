import { JSON } from "@w3bstream/wasm-sdk";

import { getPayloadValue, getField } from "../payload-parser";
import { DEVICE_MESSAGE, DEVICE_MESSAGE_2 } from "./fixtures/msg";

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
