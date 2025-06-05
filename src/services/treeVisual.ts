import type { TreeDataResponse } from "../types/TreeData";
import { axiosInstance } from "../utils/helper";

export const getTreeVisualData = async () => {
  try {
    const res = await axiosInstance.get<TreeDataResponse>("/treevisual");
    return res.data.Result;
  } catch (err) {
    console.error(err);
  }
};
