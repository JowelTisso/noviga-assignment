import {
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import React, { useEffect, useState, useTransition } from "react";

import CustomNode from "../components/Node";
import { getTreeVisualData } from "../services/treeVisual";
import { NODE_COLOR, type TreeVisualDataType } from "../types/TreeData";
import { COLORS } from "../utils/Colors";
import EditNodeModal from "../components/EditNodeModal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { toggleEditNodeModal } from "../reducers/treeSlice";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const nodeTypes = {
  node: CustomNode,
};

const nodeWidth = 450;
const nodeHeight = 50;

function getBgColor(
  machine_id: number,
  notAllowed: number[],
  bypass: number[]
): string {
  if (notAllowed.includes(machine_id)) return COLORS.node_red;
  if (bypass.includes(machine_id)) return COLORS.node_blue;
  return COLORS.node_white;
}

function getBgColorName(
  machine_id: number,
  notAllowed: number[],
  bypass: number[]
): string {
  if (notAllowed.includes(machine_id)) return NODE_COLOR.RED;
  if (bypass.includes(machine_id)) return NODE_COLOR.BLUE;
  return NODE_COLOR.WHITE;
}

function getFontColor(
  machine_id: number,
  notAllowed: number[],
  bypass: number[]
): string {
  if (notAllowed.includes(machine_id)) return COLORS.font_white;
  if (bypass.includes(machine_id)) return COLORS.font_white;
  return COLORS.font_black;
}

function getFlowElements(data: TreeVisualDataType): {
  nodes: Node[];
  edges: Edge[];
} {
  if (!data) {
    return;
  }
  const { prod_machine_map, not_allowed_list, bypass_list } = data;

  const dGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const direction = "TB"; //Top to bottom
  dGraph.setGraph({ rankdir: direction });

  prod_machine_map.forEach((node) => {
    dGraph.setNode(node.id.toString(), {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  const edges: Edge[] = [];
  prod_machine_map.forEach((node) => {
    node.input_stations.forEach((source) => {
      dGraph.setEdge(source.toString(), node.id.toString());
      edges.push({
        id: `${source}->${node.id}`,
        source: source.toString(),
        target: node.id.toString(),
        type: "step",
      });
    });
  });

  dagre.layout(dGraph);

  const nodes: Node[] = prod_machine_map.map((node) => {
    const nodeWithPosition = dGraph.node(node.id.toString());
    return {
      id: node.id.toString(),
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      data: {
        name: node.name,
        station_number: node.station_number,
        machine_id: node.machine_id,
        color: getBgColorName(node.machine_id, not_allowed_list, bypass_list),
      },
      type: "node",
      style: {
        background: getBgColor(node.machine_id, not_allowed_list, bypass_list),
        color: getFontColor(node.machine_id, not_allowed_list, bypass_list),
        borderRadius: 10,
      },
      draggable: false,
    };
  });

  return { nodes, edges };
}

const TreeData: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [treeVisualData, setTreeVisualData] = useState<TreeVisualDataType>();

  const { openNodeModal } = useSelector((state: RootState) => state.tree);
  const dispatch = useDispatch();

  const [pending, startTransition] = useTransition();

  const onModalSave = (
    name: string,
    station_number: string,
    color: NODE_COLOR,
    machine_id: number
  ) => {
    startTransition(() => {
      setTreeVisualData((prevState) => {
        let updatedBypassList = [...prevState.bypass_list];
        let updatedNotAllowedList = [...prevState.not_allowed_list];

        switch (color) {
          case NODE_COLOR.BLUE:
            if (!prevState.bypass_list.includes(machine_id)) {
              updatedBypassList.push(machine_id);
              updatedNotAllowedList = updatedNotAllowedList.filter(
                (id) => id !== machine_id
              );
            }
            break;
          case NODE_COLOR.RED:
            if (!prevState.not_allowed_list.includes(machine_id)) {
              updatedNotAllowedList.push(machine_id);
              updatedBypassList = updatedBypassList.filter(
                (id) => id !== machine_id
              );
            }
            break;
          case NODE_COLOR.WHITE:
            updatedBypassList = updatedBypassList.filter(
              (id) => id !== machine_id
            );
            updatedNotAllowedList = updatedNotAllowedList.filter(
              (id) => id !== machine_id
            );
            break;
          default:
            break;
        }

        const updatedProdMachineMap = prevState.prod_machine_map.map((node) => {
          if (node.machine_id === machine_id) {
            return {
              ...node,
              name,
              station_number,
            };
          }
          return node;
        });

        return {
          bypass_list: updatedBypassList,
          not_allowed_list: updatedNotAllowedList,
          prod_machine_map: updatedProdMachineMap,
        };
      });
      dispatch(toggleEditNodeModal(false));
    });
  };

  useEffect(() => {
    (async () => {
      const treeResponse = await getTreeVisualData();
      if (treeResponse) {
        setTreeVisualData(treeResponse);
      }
    })();
  }, []);

  useEffect(() => {
    if (treeVisualData) {
      const { nodes, edges } = getFlowElements(treeVisualData);
      setNodes(nodes);
      setEdges(edges);
    }
  }, [treeVisualData, setNodes, setEdges]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {pending && (
        <Box className="loader">
          <CircularProgress />
        </Box>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      />
      {openNodeModal && (
        <EditNodeModal
          open={openNodeModal}
          handleClose={() => dispatch(toggleEditNodeModal(false))}
          onSave={onModalSave}
        />
      )}
    </div>
  );
};

export default TreeData;
