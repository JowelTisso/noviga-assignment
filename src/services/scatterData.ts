import type {
  Anomaly,
  ChangeLogResponse,
  PredictionData,
  TimeseriesResponse,
} from "../types/ScatterData";
import { axiosInstance } from "../utils/helper";

export const getChangeLogData = async (
  machineId: string,
  from_time: string,
  to_time: string,
  limit = 10
) => {
  try {
    const res = await axiosInstance.get<ChangeLogResponse>(
      `/changelogs?limit=${limit}&machine_id=${machineId}&from_time=${from_time}&to_time=${to_time}`
    );

    return res.data.Result;
  } catch (err) {
    console.error(err);
  }
};

export const getPredictionData = async (
  machineId: string,
  from_time: string,
  to_time: string
) => {
  try {
    const res = await axiosInstance.get<{
      status: boolean;
      Result: PredictionData;
    }>(
      `/predictions?machine_id=${machineId}&from_time=${from_time}&to_time=${to_time}`
    );
    return res.data.Result;
  } catch (err) {
    console.error(err);
  }
};

export const getTimeseriesData = async (
  machineId: string,
  cycle_log_id: string,
  signal: string,
  anomaly: Anomaly
) => {
  try {
    const res = await axiosInstance.get<TimeseriesResponse>(
      `/timeseries?machine_id=${machineId}&cycle_log_id=${cycle_log_id}&signal=${signal}&anomaly=${anomaly}`
    );

    return res.data.Result;
  } catch (err) {
    console.error(err);
  }
};
