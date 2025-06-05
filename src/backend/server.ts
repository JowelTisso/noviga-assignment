import { createServer } from "miragejs";
import {
  getChangeLogs,
  getTimeseriesData,
  getPredictionData,
} from "./controllers/ScatterData";
import { getTreeVisualData } from "./controllers/TreeVisualization";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    routes() {
      this.namespace = "";
      this.get("/changelogs", getChangeLogs);
      this.get("/predictions", getPredictionData);
      this.get("/timeseries", getTimeseriesData);
      this.get("/treevisual", getTreeVisualData);
      this.passthrough("/data/**");
    },
  });
}
