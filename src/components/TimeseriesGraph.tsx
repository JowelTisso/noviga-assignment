import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RootState } from "../store/store";
import type { FormattedTimeSeriesDataType } from "../reducers/mainSlice";
import { useMemo, memo } from "react";
import { COLORS } from "../utils/Colors";
import CustomTooltip from "./CustomTooltip";
import { GraphType, type TooltipPayload } from "../types/ScatterData";

const TimeseriesGraph = memo(({ signal }: { signal: string }) => {
  const timeSeriesData = useSelector(
    (state: RootState) => state.main.timeSeriesData
  );

  const formatTimeSeriesData = (
    timeSeriesData: FormattedTimeSeriesDataType
  ) => {
    if (timeSeriesData) {
      const lineChartData = timeSeriesData.time.map((time, i) => ({
        time,
        actual: timeSeriesData.actual[i],
        ideal: timeSeriesData.ideal[i],
      }));
      return lineChartData;
    }
    return [];
  };

  const formattedTimeSeriesData = useMemo(
    () => formatTimeSeriesData(timeSeriesData),
    [timeSeriesData]
  );

  const formatSignalName = (name: string) => {
    const nameParts = name.split("_");
    const namesArray = nameParts.map((namePart) => {
      const partCharacters = namePart.split("");
      const partFirstCharUpperCase = partCharacters.map((char, i) =>
        i === 0 ? char.toUpperCase() : char
      );
      const wordParts = partFirstCharUpperCase.join("");
      return wordParts;
    });

    const graphName = namesArray.join(" ");

    return graphName;
  };

  return (
    <Box className="box scatter-graph" sx={{ mt: 1 }}>
      <Box className="scatter-graph-header">
        <p>{formatSignalName(signal)}</p>
      </Box>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={formattedTimeSeriesData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            label={{ value: "Seconds", position: "bottom", fontSize: 14 }}
            fontSize={12}
            interval={3}
            tickFormatter={(tick) => parseInt(tick).toString()}
          />
          <YAxis
            label={{
              value: "Values",
              position: "left",
              angle: -90,
              fontSize: 14,
            }}
            fontSize={12}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => (
              <CustomTooltip
                active={active}
                payload={payload as TooltipPayload[]}
                type={GraphType.GRAPH2}
              />
            )}
          />
          <Legend iconSize={12} verticalAlign="top" align="right" />
          <Line type="monotone" dataKey="actual" stroke={COLORS.actual_color} />
          <Line type="monotone" dataKey="ideal" stroke={COLORS.ideal_color} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
});

export default TimeseriesGraph;
