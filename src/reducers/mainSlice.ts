import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FormattedTimeSeriesDataType {
  time: number[];
  actual: number[];
  ideal: number[];
}

export interface MainState {
  openDrawer: boolean;
  timeSeriesData?: FormattedTimeSeriesDataType;
  loading: boolean;
}

const initialState: MainState = {
  openDrawer: false,
  timeSeriesData: null,
  loading: false,
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
  },
});

export const { toggleDrawer, setTimeSeriesData, setLoading } =
  mainSlice.actions;

export default mainSlice.reducer;
