import "./ScatterPlotGraph.scss";
import { memo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { COLORS } from "../utils/Colors";
import { format } from "date-fns";
import {
  Anomaly,
  GraphType,
  type ChangeLogEntry,
  type ScatterPlotType,
  type TimeSeriesDataType,
  type TooltipPayload,
} from "../types/ScatterData";
import {
  Circle,
  Diamond,
  Square,
  Triangle,
  ChartNoAxesCombined,
} from "lucide-react";
import Box from "@mui/material/Box";
import CustomTooltip from "./CustomTooltip";
import { getTimeseriesData } from "../services/scatterData";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setTimeSeriesData } from "../reducers/mainSlice";
import type { RootState } from "../store/store";

const legends = [
  {
    id: 1,
    text: "Cycle Anomaly : False",
    icon: <Circle fill="#28a745" color="#28a745" size={10} />,
  },
  {
    id: 2,
    text: "Cycle Anomaly : True",
    icon: <Diamond fill="#dc3545" color="#dc3545" size={10} />,
  },
  {
    id: 3,
    text: "Cycle Anomaly : Null",
    icon: <Square fill="#4b4b4b" color="#4b4b4b" size={10} />,
  },
  {
    id: 4,
    text: "Sequence Anomaly : Null",
    icon: <Triangle fill="#1a1a1a" color="#1a1a1a" size={10} />,
  },
  {
    id: 5,
    text: "Threshold",
    icon: <ChartNoAxesCombined fill="#ff815b" color="#ff815b" size={10} />,
  },
];

const tempCycleLogId = {
  red: 89280,
  green: 88362,
  black: 89152,
};

const ScatterPlotGraph = memo(
  ({ xTicks, scatterPlotData, thresholds, signal }: ScatterPlotType) => {
    const dispatch = useDispatch();

    const toolSequenceSnapshot = useSelector(
      (state: RootState) => state.main.toolSequenceSnapshot
    );
    const machineIdSnapshot = useSelector(
      (state: RootState) => state.main.machineIdSnapshot
    );
    const changeLogsSnapshot = useSelector(
      (state: RootState) => state.main.changeLogsSnapshot
    );

    const dataPointClickHandler = async (cycleData: {
      cycle_log_id: string;
      anomaly: Anomaly;
      start_time: Date;
    }) => {
      dispatch(setLoading(true));
      const { cycle_log_id, anomaly, start_time } = cycleData;

      const idealSignals = fetchIdealSignals(
        changeLogsSnapshot,
        start_time,
        toolSequenceSnapshot
      );

      const timeseriesResponse = await getTimeseriesData(
        machineIdSnapshot,
        cycle_log_id,
        signal,
        anomaly
      );

      const { timeRange, actualSignals } = formatTimeSeriesData(
        timeseriesResponse,
        anomaly,
        signal
      );

      dispatch(
        setTimeSeriesData({
          time: timeRange,
          actual: actualSignals,
          ideal: idealSignals,
        })
      );
      dispatch(setLoading(false));
    };

    const fetchIdealSignals = (
      changeLogs: ChangeLogEntry[],
      start_time: Date,
      sequence: string
    ) => {
      const logWithIdealSignal = changeLogs.find(
        (log) =>
          new Date(log.start_time) <= new Date(start_time) &&
          new Date(start_time) <= new Date(log.end_time)
      );

      const idealSignals = logWithIdealSignal
        ? logWithIdealSignal.learned_parameters[sequence]?.average_list
        : [];
      return idealSignals;
    };

    const formatTimeSeriesData = (
      timeseriesResponse: TimeSeriesDataType,
      anomaly: Anomaly,
      signal: string
    ) => {
      try {
        const timeRange: number[] = [];
        const actualSignals: number[] = [];

        // Here I am simulating timeseries graph for all data points as given timeseries json has only one cycle_log data for each anomaly
        // cycle_log_id should be dynamic and should come from cycleData.
        let cycle_log_id = 0;

        switch (anomaly) {
          case Anomaly.Green:
            cycle_log_id = tempCycleLogId.green;
            break;
          case Anomaly.Red:
            cycle_log_id = tempCycleLogId.red;
            break;
          case Anomaly.Black:
            cycle_log_id = tempCycleLogId.black;
            break;
          default:
            cycle_log_id = tempCycleLogId.green;
            break;
        }

        if (timeseriesResponse) {
          Object.entries(
            timeseriesResponse.data[cycle_log_id]?.cycle_data[signal]
          ).forEach(([time, value]) => {
            timeRange.push(parseFloat(time));
            actualSignals.push(value);
          });
        }

        return { timeRange, actualSignals };
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <Box className="box scatter-graph" sx={{ mt: 1 }}>
        <Box className="scatter-graph-header">
          <p>Scatter Plot</p>

          <div className="legend-wrapper">
            {legends.map((legend) => (
              <span key={legend.id} className="legend-details">
                {legend.icon}
                <span className="legend-text">{legend.text}</span>
              </span>
            ))}
          </div>
        </Box>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="x"
              type="number"
              name="Time"
              scale="time"
              ticks={xTicks}
              fontSize={12}
              domain={["dataMin", "dataMax"]}
              label={{ value: "Time", position: "bottom", fontSize: 14 }}
              tickFormatter={(tick) => format(new Date(tick), "d MMM")}
            />
            <YAxis
              dataKey="y"
              type="number"
              name="Values"
              fontSize={12}
              tickFormatter={(tick) => tick.toFixed(0)}
              label={{
                value: "Values",
                position: "left",
                angle: -90,
                fontSize: 14,
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => (
                <CustomTooltip
                  active={active}
                  payload={payload as TooltipPayload[]}
                  type={GraphType.GRAPH1}
                />
              )}
            />
            <Scatter
              name="Anomaly false"
              data={scatterPlotData?.anomalyFalseData}
              fill={COLORS.anomaly_false}
              isAnimationActive={false}
              onClick={dataPointClickHandler}
            />
            <Scatter
              name="Anomaly true"
              data={scatterPlotData?.anomalyTrueData}
              fill={COLORS.anomaly_true}
              isAnimationActive={false}
              shape="diamond"
              onClick={dataPointClickHandler}
            />
            <Scatter
              name="Sequence null"
              data={scatterPlotData?.anomalyNullData}
              fill={COLORS.sequence_null}
              isAnimationActive={false}
              shape="triangle"
              onClick={dataPointClickHandler}
            />
            {thresholds?.map(({ x1, x2, y }) => (
              <ReferenceLine
                key={x1}
                stroke={COLORS.threshold}
                segment={[
                  { x: x1, y },
                  { x: x2, y },
                ]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    );
  }
);

export default ScatterPlotGraph;
