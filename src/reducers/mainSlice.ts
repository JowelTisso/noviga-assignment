import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ChangeLogEntry } from "../types/ScatterData";

export interface FormattedTimeSeriesDataType {
  time: number[];
  actual: number[];
  ideal: number[];
}

export interface MainState {
  openDrawer: boolean;
  timeSeriesData?: FormattedTimeSeriesDataType;
  loading: boolean;
  toolSequenceSnapshot: string;
  machineIdSnapshot: string;
  changeLogsSnapshot?: ChangeLogEntry[];
}

const initialState: MainState = {
  openDrawer: false,
  timeSeriesData: null,
  loading: false,
  toolSequenceSnapshot: "",
  machineIdSnapshot: "",
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    toggleDrawer: (state, action: PayloadAction<boolean>) => {
      state.openDrawer = action.payload;
    },
    setTimeSeriesData: (
      state,
      action: PayloadAction<FormattedTimeSeriesDataType>
    ) => {
      state.timeSeriesData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    saveSearchValueSnapShot: (
      state,
      action: PayloadAction<{
        tool: string;
        machineId: string;
        changeLogs: ChangeLogEntry[];
      }>
    ) => {
      state.toolSequenceSnapshot = action.payload.tool;
      state.machineIdSnapshot = action.payload.machineId;
      state.changeLogsSnapshot = action.payload.changeLogs;
    },
  },
});

export const {
  toggleDrawer,
  setTimeSeriesData,
  setLoading,
  saveSearchValueSnapShot,
} = mainSlice.actions;

export default mainSlice.reducer;
