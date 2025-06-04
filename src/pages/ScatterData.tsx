import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState, useTransition } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import "./ScatterData.scss";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import { combineDateAndTimeToISO } from "../utils/helper";
import type {
  AxisValueType,
  ChangeLogEntry,
  PredictionData,
  ScatterPlotDataType,
  ThresholdDataType,
} from "../types/ScatterData";
import { getChangeLogData, getPredictionData } from "../services/scatterData";
import { addDays } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";
import ScatterPlotGraph from "../components/ScatterPlotGraph";

const machines = [
  {
    id: 1,
    machineId: "1e776bfb2d2947648a8c01d60670af94",
    name: "SSP0173",
  },
  {
    id: 2,
    machineId: "2c685d818c874c46a241dc7c217bc503",
    name: "SSP0167",
  },
];

const ScatterData = () => {
  const [machineId, setMachineId] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2025-03-01T00:00:00")
  );
  const [startTime, setStartTime] = useState<Date | null>(
    new Date("2025-03-01T10:00:00")
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date("2025-05-27T00:00:00")
  );
  const [endTime, setEndTime] = useState<Date | null>(
    new Date("2025-05-27T18:00:00")
  );
  const [toolSequence, setToolSequence] = useState("");
  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);

  const [xTicks, setXTicks] = useState([]);
  const [scatterPlotData, setScatterPlotData] = useState<ScatterPlotDataType>();
  const [thresholds, setThresholds] = useState<ThresholdDataType[]>([]);

  const [pending, startTransition] = useTransition();

  const onMachineChange = (event: SelectChangeEvent) => {
    setMachineId(event.target.value);
  };

  const onStartDateChange = (date: Date) => {
    setStartDate(date);
  };

  const onStartTimeChange = (time: Date) => {
    setStartTime(time);
  };

  const onEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  const onEndTimeChange = (time: Date) => {
    setEndTime(time);
  };

  const onToolChange = (event: SelectChangeEvent) => {
    const sequence = event.target.value;
    setToolSequence(sequence);

    const selectedThreshold: ThresholdDataType[] = [];

    changeLogs.forEach((log) => {
      const formattedThreshold: ThresholdDataType = {
        x1: new Date(log.start_time).getTime(),
        x2: new Date(log.end_time).getTime(),
        y: log.learned_parameters[sequence].threshold,
      };
      selectedThreshold.push(formattedThreshold);
    });

    setThresholds(selectedThreshold);
  };

  const formatToolTOptions = (
    changeLogs: ChangeLogEntry[]
  ): { id: number; label: string; value: string }[] => {
    // Selecting the first tool sequence map from the first changelog data as it is same for all the changelog instance of a machine as mentioned
    return changeLogs.length
      ? Object.entries(changeLogs[0].config_parameters.tool_sequence_map).map(
          ([sequence, value]) => ({
            id: value,
            label: value.toString(),
            value: sequence,
          })
        )
      : [
          {
            id: 1,
            label: "No option for selected Date",
            value: null,
          },
        ];
  };

  const onSearch = () => {
    startTransition(async () => {
      const from_time = combineDateAndTimeToISO(startDate, startTime);
      const to_time = combineDateAndTimeToISO(endDate, endTime);
      const predictions = await getPredictionData(
        machineId,
        from_time,
        to_time
      );
      const xTicks = generateXAxisTicks(startDate, endDate);
      setXTicks(xTicks);

      // Hardcoding first signal from signals array as there is no mentioned option to select signal
      const signal = changeLogs[0].config_parameters.signals[0];
      const formattedPredictionData = formatPredictionData(predictions, signal);
      setScatterPlotData(formattedPredictionData);
    });
  };

  const formatPredictionData = (
    predictionData: PredictionData,
    signal: string
  ) => {
    const anomalyTrueData: AxisValueType[] = [];
    const anomalyFalseData: AxisValueType[] = [];
    const anomalyNullData: AxisValueType[] = [];

    if (predictionData) {
      Object.entries(predictionData.cycles).forEach(([xValue, cycleData]) => {
        switch (cycleData.data[signal].anomaly) {
          case true:
            anomalyTrueData.push({
              x: parseInt(xValue) * 1000,
              y: cycleData.data[signal].distance,
              id: cycleData.id,
            });
            break;
          case false:
            anomalyFalseData.push({
              x: parseInt(xValue) * 1000,
              y: cycleData.data[signal].distance,
              id: cycleData.id,
            });
            break;
          case null:
            anomalyNullData.push({
              x: parseInt(xValue) * 1000,
              y: cycleData.data[signal].distance,
              id: cycleData.id,
            });
            break;
          default:
            break;
        }
      });
    }

    return { anomalyTrueData, anomalyFalseData, anomalyNullData };
  };

  const generateXAxisTicks = (start: Date, end: Date): number[] => {
    const ticks: number[] = [];
    let current = start;

    while (current <= end) {
      ticks.push(current.getTime());
      current = addDays(current, 1);
    }

    return ticks;
  };

  const isSearchActive =
    machineId && startDate && startTime && endDate && endTime && toolSequence
      ? false
      : true;

  useEffect(() => {
    startTransition(() => {
      if (machineId && startDate && startTime && endDate && endTime) {
        const from_time = combineDateAndTimeToISO(startDate, startTime);
        const to_time = combineDateAndTimeToISO(endDate, endTime);
        (async () => {
          const changeLogResponse = await getChangeLogData(
            machineId,
            from_time,
            to_time
          );
          setChangeLogs(changeLogResponse);
        })();
      }
    });
  }, [machineId, startDate, startTime, endDate, endTime]);

  return (
    <div className="wrapper">
      {pending && (
        <Box className="loader">
          <CircularProgress />
        </Box>
      )}
      <Box className="filter-box">
        <FormControl className="form-control" size="small">
          <InputLabel id="machine">Machine</InputLabel>
          <Select
            labelId="machine"
            id="machine-select"
            value={machineId}
            label="Machine"
            className="form-item"
            onChange={onMachineChange}
          >
            {machines.map((machine) => (
              <MenuItem value={machine.machineId}>{machine.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="form-control" size="small">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start date"
              className="form-item"
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
              value={startDate}
              onChange={onStartDateChange}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl className="form-control" size="small">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Start time"
              value={startTime}
              className="form-item"
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
              onChange={onStartTimeChange}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl className="form-control" size="small">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End date"
              className="form-item"
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
              value={endDate}
              onChange={onEndDateChange}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl className="form-control" size="small">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="End time"
              value={endTime}
              className="form-item"
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
              onChange={onEndTimeChange}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl className="form-control" size="small">
          <InputLabel id="demo-simple-select-label">Select tool</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={toolSequence}
            label="Select tool"
            className="form-item"
            onChange={onToolChange}
          >
            {formatToolTOptions(changeLogs).map((option) => (
              <MenuItem value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="form-btn">
          <Button
            variant="contained"
            size="medium"
            onClick={onSearch}
            disabled={isSearchActive}
          >
            Search
          </Button>
        </FormControl>
      </Box>
      <Box className="box">
        <p className="title">Unprocessed Tool</p>
        <Stack direction="row" spacing={1}>
          <Chip label="1:401" variant="outlined" sx={{ borderRadius: 3 }} />
          <Chip
            label="Chip Outlined"
            variant="outlined"
            sx={{ borderRadius: 3 }}
          />
          <Chip
            label="Chip Outlined"
            variant="outlined"
            sx={{ borderRadius: 3 }}
          />
          <Chip
            label="Chip Outlined"
            variant="outlined"
            sx={{ borderRadius: 3 }}
          />
        </Stack>
      </Box>

      <ScatterPlotGraph
        xTicks={xTicks}
        scatterPlotData={scatterPlotData}
        thresholds={thresholds}
      />
    </div>
  );
};

export default ScatterData;
