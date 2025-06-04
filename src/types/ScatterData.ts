export interface ConfigParameters {
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
  signals: string[];
}

export interface LearnedParameters {
  [sequence: string]:
    | {
        threshold: number;
        average_list: number[];
      }
    | undefined;
}

export interface ChangeLogEntry {
  id: string;
  machine_id: string;
  start_time: string;
  end_time: string;
  learned_time: string;
  config_parameters: ConfigParameters;
  learned_parameters: LearnedParameters;
}

export interface ChangeLogResponse {
  Status: boolean;
  Result: ChangeLogEntry[];
}

export interface SignalData {
  distance: number;
  anomaly: boolean | null;
}

export interface CycleData {
  data: {
    [signal: string]: SignalData;
  };
  id: string;
}

export interface Cycle {
  [epochTime: string]: CycleData;
}

export interface PredictionData {
  machine_id: string;
  last_synced_time: Date;
  unprocessed_sequences: Record<string, number>;
  from_time: Date;
  to_time: Date;
  cycles: Cycle;
}

export interface PredictionDataResponse {
  Status: boolean;
  Result: PredictionData[];
}

export interface AxisValueType {
  x: number;
  y: number;
  id: string;
}

export interface ScatterPlotDataType {
  anomalyTrueData: AxisValueType[];
  anomalyFalseData: AxisValueType[];
  anomalyNullData: AxisValueType[];
}

export interface ThresholdDataType {
  x1: number;
  x2: number;
  y: number;
}
