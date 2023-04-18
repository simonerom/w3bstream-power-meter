import {Simulator,DataPointGenerator} from "@nick-iotex/w3bstream-http-client-simulator";

const pubId = "meter1";
const pubToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQYXlsb2FkIjoiMTEyNzQ5MjM5MjUyMjc1MjUiLCJpc3MiOiJ3M2JzdHJlYW0iLCJleHAiOjE2ODEyMjU0NDF9.uIiBNJuYnEec-9FdiSrxbdqp_Uv8QVuDnZ05lvXedXc"
const w3bstreamEndpoint = "http://localhost:8888/srv-applet-mgr/v0/event/smart_energy";

const simulator = new Simulator(pubId, pubToken, "DATA", "DATA", w3bstreamEndpoint);
simulator.init();

type EnergyDataPoint = {
    sensor_reading: number;
    timestamp: number;
  };

  const generatorFunction = () => ({    
    sensor_reading: DataPointGenerator.randomizer(0, 12),
    timestamp: DataPointGenerator.timestampGenerator(),
  });

  const dataGenerator = new DataPointGenerator<EnergyDataPoint>(
    generatorFunction
  );

  simulator.dataPointGenerator = dataGenerator;

  async function start() {
    try {
      console.log("Starting simulator");
     //const message = await simulator.sendSingleMessage();
     simulator.powerOn(5);
     //console.log(message);
    } catch (error) {
      console.log(error);
    }
}
  start();

