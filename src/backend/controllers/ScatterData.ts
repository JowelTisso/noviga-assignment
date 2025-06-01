import { Response, type Request } from "miragejs";

interface ConfigParameters {
  tool_sequence_map: Record<string, number | undefined>;
  sequence: Record<
    string,
    | {
        window: number;
        max_points: number;
        min_points: number;
      }
    | undefined
  >;
}

interface LearnedParameters {
  [sequence: string]:
    | {
        threshold: number;
        average_list: number[];
      }
    | undefined;
}

interface ChangeLogEntry {
  machine_id: string;
  config_parameters: ConfigParameters;
  learned_parameters: LearnedParameters;
}

interface ChangeLogResponse {
  Status: boolean;
  Result: ChangeLogEntry[];
}

interface SignalData {
  distance: number;
  anomaly: boolean | null;
}

interface CycleData {
  data: {
    [signal: string]: SignalData;
  };
}

interface Cycle {
  [epochTime: string]: CycleData;
}

interface PredictionDataResponse {
  Status: boolean;
  Result: {
    machine_id: string;
    last_synced_time: Date;
    unprocessed_sequences: Record<string, number>;
    from_time: Date;
    to_time: Date;
    cycles: Cycle;
  }[];
}

const AnomalyType = {
  true: "red",
  false: "green",
  null: "black",
};

export const getChangeLogs = async (_, request: Request) => {
  const machine_id = request.queryParams.machine_id;
  const limit = Number(request.queryParams.limit) || 10;

  const data = await fetch("/data/changelog.json");
  const changeLogsJson = await data.json();
  const allResults = (changeLogsJson as ChangeLogResponse).Result;

  if (!machine_id) {
    return new Response(
      400,
      {},
      { Status: false, Error: "machine_id is required" }
    );
  }

  const filtered = allResults.filter(
    (entry) => entry.machine_id === machine_id
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
    (item) => item.machine_id === machine_id
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
  const filteredCycles: Cycle = {};

  const from = new Date(from_time as string);
  const to = new Date(to_time as string);

  for (const [epochStr, cycle] of Object.entries(machinePredictions.cycles)) {
    const epoch = parseInt(epochStr, 10);
    const dateFromEpoch = new Date(epoch * 1000);
    if (dateFromEpoch >= from && dateFromEpoch <= to) {
      filteredCycles[epochStr] = cycle;
    }
  }

  return {
    Status: true,
    cycles: filteredCycles,
  };
};

export const getCycleData = async (_, request: Request) => {
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

  const anomalyType =
    AnomalyType[anomaly as keyof typeof AnomalyType] || "green";

  try {
    const response = await fetch("/data/cycleData.json");
    const json = await response.json();

    const result = {
      Status: true,
      Result: {
        data: {
          [cycle_log_id as string]:
            json.machines[machine_id as string][anomalyType as string] || {},
        },
      },
    };

    return result;
  } catch (err) {
    return new Response(
      500,
      {},
      {
        Status: false,
        Error: "Failed to load timeseries data",
      }
    );
  }
};
