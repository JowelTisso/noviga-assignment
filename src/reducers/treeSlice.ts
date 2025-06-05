import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Node } from "../types/TreeData";

type initialState = {
  openNodeModal: boolean;
  selectedNode?: Node;
};

const initialState: initialState = {
  openNodeModal: false,
};

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    toggleEditNodeModal: (state, action: PayloadAction<boolean>) => {
      state.openNodeModal = action.payload;
    },
    updateSelectNode: (state, action: PayloadAction<Node>) => {
      state.selectedNode = action.payload;
    },
  },
});

export const { toggleEditNodeModal, updateSelectNode } = treeSlice.actions;

export default treeSlice.reducer;
