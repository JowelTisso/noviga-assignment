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
import type {
  ScatterPlotDataType,
  ThresholdDataType,
} from "../types/ScatterData";
import {
  Circle,
  Diamond,
  Square,
  Triangle,
  ChartNoAxesCombined,
} from "lucide-react";
import Box from "@mui/material/Box";

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

export type ScatterPlotType = {
  xTicks: number[];
  scatterPlotData: ScatterPlotDataType;
  thresholds: ThresholdDataType[];
};

const ScatterPlotGraph = memo(
  ({ xTicks, scatterPlotData, thresholds }: ScatterPlotType) => {
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
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart
            width={730}
            height={250}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 50,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="x"
              type="number"
              name="Time"
              scale="time"
              ticks={xTicks}
              tick={{ fontSize: 12 }}
              domain={["dataMin", "dataMax"]}
              label={{ value: "Time", position: "bottom" }}
              tickFormatter={(tick) => format(new Date(tick), "d MMM")}
            />
            <YAxis
              dataKey="y"
              type="number"
              name="Values"
              tick={{ fontSize: 12 }}
              tickFormatter={(tick) => tick.toFixed(0)}
              label={{ value: "Values", position: "left", angle: -90 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const time = payload[0];
                  const value = payload[1];
                  const id = time.payload.id;

                  const formattedDate = new Date(
                    time.value as number
                  ).toDateString();

                  const formattedValue = Number(value.value).toFixed(0);

                  return (
                    <div className="tooltip-wrapper">
                      <p className="tooltip-txt">ID : {id} </p>
                      <p className="tooltip-txt">Time : {formattedDate} </p>
                      <p className="tooltip-txt">Value : {formattedValue} </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Anomaly false"
              data={scatterPlotData?.anomalyFalseData}
              fill={COLORS.anomaly_false}
              isAnimationActive={false}
            />
            <Scatter
              name="Anomaly true"
              data={scatterPlotData?.anomalyTrueData}
              fill={COLORS.anomaly_true}
              isAnimationActive={false}
              shape="diamond"
            />
            <Scatter
              name="Sequence null"
              data={scatterPlotData?.anomalyNullData}
              fill={COLORS.sequence_null}
              isAnimationActive={false}
              shape="triangle"
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
