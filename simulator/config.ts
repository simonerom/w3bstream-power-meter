import dotenv from "dotenv";
dotenv.config();

export default {
  PUB_ID: process.env.PUB_ID || "",
  PUB_TOKEN: process.env.PUB_TOKEN || "",
  W3BSTREAM_ENDPOINT: `https://dev.w3bstream.com/api/w3bapp/event/${process.env.PROJECT_NAME}`,
};
