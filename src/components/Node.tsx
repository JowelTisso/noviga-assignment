import "./Node.scss";
import type { NodeType } from "../types/TreeData";
import { Handle, Position } from "@xyflow/react";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { toggleEditNodeModal, updateSelectNode } from "../reducers/treeSlice";

const Node = ({ data }: NodeType) => {
  const dispatch = useDispatch();

  return (
    <Tooltip
      slotProps={{
        tooltip: {
          style: {
            backgroundColor: "whitesmoke",
            color: "black",
          },
        },
      }}
      title={
        <>
          <p>Station number : {data.station_number}</p>
          <p>Name : {data.name}</p>
        </>
      }
    >
      <div
        className="node-wrapper"
        onClick={() => {
          dispatch(updateSelectNode(data));
          dispatch(toggleEditNodeModal(true));
        }}
      >
        <div className="inner-border">
          <p>{data.name}</p>
          <p>{data.station_number}</p>
        </div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </Tooltip>
  );
};

export default Node;
