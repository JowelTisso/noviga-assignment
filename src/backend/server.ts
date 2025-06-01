import { createServer } from "miragejs";
import {
  getChangeLogs,
  getCycleData,
  getPredictionData,
} from "./controllers/ScatterData";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    routes() {
      this.namespace = "";
      this.get("/changelogs", getChangeLogs);
      this.get("/predictions", getPredictionData);
      this.get("/cycles", getCycleData);
      this.passthrough("/data/**");
    },
  });
}
