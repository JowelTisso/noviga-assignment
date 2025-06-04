import type { ChangeLogResponse, PredictionData } from "../types/ScatterData";
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
    console.log(err);
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
    console.log(err);
  }
};
