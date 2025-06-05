import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "../reducers/mainSlice";
import treeReducer from "../reducers/treeSlice";

export const store = configureStore({
  reducer: {
    main: mainReducer,
    tree: treeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
