import "./EditNodeModal.scss";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { NODE_COLOR } from "../types/TreeData";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
  p: 3,
};

type EditModalPropType = {
  open: boolean;
  handleClose: () => void;
  onSave: (
    name: string,
    stationNumber: string,
    color: string,
    machineId: number
  ) => void;
};

const EditNodeModal = ({ open, handleClose, onSave }: EditModalPropType) => {
  const selectedNode = useSelector(
    (state: RootState) => state.tree.selectedNode
  );

  const [color, setColor] = useState(selectedNode.color);
  const [name, setName] = useState(selectedNode.name);
  const [stationNumber, setStationNumber] = useState(
    selectedNode.station_number
  );

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onStationNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStationNumber(e.target.value);
  };

  const onColorChange = (event: SelectChangeEvent) => {
    setColor(event.target.value as string);
  };

  const saveHandler = () => {
    onSave(name, stationNumber, color, selectedNode.machine_id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-content" sx={style}>
        <p>Edit Node Details:</p>
        <Box className="input-wrapper">
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            size="small"
            value={name}
            onChange={onNameChange}
          />
          <TextField
            id="station_number"
            label="Station number"
            variant="outlined"
            size="small"
            value={stationNumber}
            onChange={onStationNumberChange}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="node-color">Color</InputLabel>
            <Select
              labelId="node-color"
              id="node-color"
              value={color}
              label="Color"
              onChange={onColorChange}
            >
              <MenuItem value={NODE_COLOR.BLUE}>Blue</MenuItem>
              <MenuItem value={NODE_COLOR.RED}>Red</MenuItem>
              <MenuItem value={NODE_COLOR.WHITE}>White</MenuItem>
            </Select>
          </FormControl>
          <Button
            sx={{ width: 120, marginLeft: "auto", marginTop: 2 }}
            variant="contained"
            size="small"
            onClick={saveHandler}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditNodeModal;
