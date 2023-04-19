import { DataPointGenerator } from "@nick-iotex/w3bstream-http-client-simulator";

type EnergyDataPoint = {
  sensor_reading: number;
  timestamp: number;
};

const generatorFunction = () => ({
  sensor_reading: DataPointGenerator.randomizer(0, 12),
  timestamp: DataPointGenerator.timestampGenerator(),
});

export default new DataPointGenerator<EnergyDataPoint>(generatorFunction);
