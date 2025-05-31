import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MainState {
  openDrawer: boolean;
}

const initialState: MainState = {
  openDrawer: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    toggleDrawer: (state, action: PayloadAction<boolean>) => {
      state.openDrawer = action.payload;
    },
  },
});

export const { toggleDrawer } = mainSlice.actions;

export default mainSlice.reducer;
