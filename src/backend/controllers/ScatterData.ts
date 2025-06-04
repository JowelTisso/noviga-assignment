import { Response, type Request } from "miragejs";
import type {
  ChangeLogResponse,
  PredictionDataResponse,
} from "../../types/ScatterData";

export const getChangeLogs = async (_, request: Request) => {
  const machine_id = request.queryParams.machine_id;
  const limit = Number(request.queryParams.limit) || 10;
  const from_time = request.queryParams.from_time;
  const to_time = request.queryParams.to_time;

  const data = await fetch("/data/changelog.json");
  const changeLogsJson = await data.json();
  const allResults = (changeLogsJson as ChangeLogResponse).Result;

  if (!machine_id && !from_time && !to_time) {
    return new Response(
      400,
      {},
      { Status: false, Error: "machine_id, from_time, to_time is required" }
    );
  }

  const filtered = allResults.filter(
    (item) =>
      item.machine_id === machine_id &&
      new Date(item.start_time) >= new Date(from_time as string) &&
      new Date(item.start_time) <= new Date(to_time as string)
  );

  return {
    Status: true,
    Result: filtered.slice(0, limit),
  };
};

export const getPredictionData = async (_, request: Request) => {
  const { machine_id, from_time, to_time } = request.queryParams;

  if (!machine_id || !from_time || !to_time) {
    return new Response(
      400,
      {},
      { Status: false, Error: "Missing required query params" }
    );
  }

  const data = await fetch("/data/prediction.json");
  const predictionJson: PredictionDataResponse = await data.json();
  const machinePredictions = predictionJson.Result.find(
    (item) =>
      item.machine_id === machine_id &&
      new Date(item.from_time) >= new Date(from_time as string) &&
      new Date(item.to_time) <= new Date(to_time as string)
  );
  if (!machinePredictions) {
    return new Response(
      400,
      {},
      {
        Status: false,
        Error: `Predictions for this machine id: ${machine_id} not found`,
      }
    );
  }

  const slicedCycles = {};

  Object.entries(machinePredictions.cycles)
    // .slice(0, 2000)
    .forEach(([key, value]) => {
      slicedCycles[key] = value;
    });

  return {
    Status: true,
    Result: {
      ...machinePredictions,
      cycles: slicedCycles,
    },
  };
};

export const getTimeseriesData = async (_, request: Request) => {
  const { machine_id, cycle_log_id, signal, anomaly } = request.queryParams;

  if (!machine_id || !cycle_log_id || !signal) {
    return new Response(
      400,
      {},
      {
        Status: false,
        Error: "Missing required query parameters",
      }
    );
  }

  const response = await fetch("/data/timeseries.json");
  const timeseriesJson = await response.json();

  return {
    Status: true,
    Result: {
      ...timeseriesJson.machines[machine_id as string][anomaly as string],
    },
  };
};
