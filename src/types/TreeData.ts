export interface NodeType {
  id: string;
  type: string;
  data: Node;
  draggable: boolean;
}

export interface Node {
  name: string;
  station_number: string;
  machine_id: number;
  color: string;
}

export type MachineNode = {
  id: number;
  name: string;
  station_number: string;
  machine_id: number;
  input_stations: number[];
};

export interface TreeVisualDataType {
  bypass_list: number[];
  not_allowed_list: number[];
  prod_machine_map: MachineNode[];
}

export interface TreeDataResponse {
  Status: boolean;
  Result: TreeVisualDataType;
}

export enum NODE_COLOR {
  RED = "red",
  BLUE = "blue",
  WHITE = "white",
}
