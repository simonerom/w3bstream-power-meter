import { validateMessage } from "../message-validation";
import { DEVICE_MESSAGE } from "./fixtures/msg";

test("Message validation", () => {
  describe("Should validate message", () => {
    it("should validate message", () => {
      validateMessage(DEVICE_MESSAGE);
    });
    itThrows("should throw error if message is not a valid JSON", () => {
      const invalidMessage = "invalid message";
      validateMessage(invalidMessage);
    });
  });
  describe("Data validation", () => {
    itThrows("should throw error if there is no data", () => {
      const invalidMessage =
        '{"public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if data is null", () => {
      const invalidMessage =
        '{"data":null,"public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if data is not an object", () => {
      const invalidMessage =
        '{"data":"data","public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
  });
  describe("Sensor reading validation", () => {
    itThrows("should throw if there is no sensor reading", () => {
      const invalidMessage =
        '{"data":{"timestamp":1681943510756},"public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if sensor reading is null", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":null,"timestamp":1681943510756},"public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if sensor reading is not a float", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1,"timestamp":1681943510756},"public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
  });
  describe("Timestamp validation", () => {
    itThrows("should throw if there is no timestamp", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0},"public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if timestamp is null", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":null},"public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if timestamp is not an integer", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1.0},"public_key":"public_key","signature":"signature"}';
      validateMessage(invalidMessage);
    });
  });
  describe("Public key validation", () => {
    itThrows("should throw if there is no public key", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if public key is null", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":null,"signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if public key is not a string", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":1,"signature":"signature"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if public key is empty string", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"","signature":"signature"}';
      validateMessage(invalidMessage);
    });
  });
  describe("Signature validation", () => {
    itThrows("should throw if there is no signature", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"public_key"}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if signature is null", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"public_key","signature":null}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if signature is not a string", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"public_key","signature":1}';
      validateMessage(invalidMessage);
    });
    itThrows("should throw if signature is empty string", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"public_key","signature":""}';
      validateMessage(invalidMessage);
    });
  });
});
