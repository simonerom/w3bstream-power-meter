var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Simulator, DataPointGenerator } from "@nick-iotex/w3bstream-http-client-simulator";
const pubId = "meter1";
const pubToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQYXlsb2FkIjoiMTEyNzQ5MjM5MjUyMjc1MjUiLCJpc3MiOiJ3M2JzdHJlYW0iLCJleHAiOjE2ODEyMjU0NDF9.uIiBNJuYnEec-9FdiSrxbdqp_Uv8QVuDnZ05lvXedXc";
const w3bstreamEndpoint = "http://localhost:8888/srv-applet-mgr/v0/event/smart_energy";
const simulator = new Simulator(pubId, pubToken, "DATA", "DATA", w3bstreamEndpoint);
simulator.init();
const generatorFunction = () => ({
    sensor_reading: DataPointGenerator.randomizer(0, 12),
    timestamp: DataPointGenerator.timestampGenerator(),
});
const dataGenerator = new DataPointGenerator(generatorFunction);
simulator.dataPointGenerator = dataGenerator;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Starting simulator");
            //const message = await simulator.sendSingleMessage();
            simulator.powerOn(5);
            //console.log(message);
        }
        catch (error) {
            console.log(error);
        }
    });
}
start();
