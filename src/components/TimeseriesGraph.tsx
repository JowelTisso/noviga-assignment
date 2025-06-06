import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { useMemo, memo } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import type { RootState } from "../store/store";
// import type { FormattedTimeSeriesDataType } from "../reducers/mainSlice";
import { COLORS } from "../utils/Colors";

const TimeseriesGraph = memo(({ signal }: { signal: string }) => {
  const timeSeriesData = useSelector(
    (state: RootState) => state.main.timeSeriesData
  );

  const formattedTimeSeriesData = useMemo(() => {
    if (!timeSeriesData) return [];
    return timeSeriesData.time.map((time, i) => ({
      x: time * 1000,
      actual: timeSeriesData.actual[i],
      ideal: timeSeriesData.ideal[i],
    }));
  }, [timeSeriesData]);

  const actualSeries = formattedTimeSeriesData.map((timeData) => [
    timeData.x,
    timeData.actual,
  ]);
  const idealSeries = formattedTimeSeriesData.map((timeData) => [
    timeData.x,
    timeData.ideal,
  ]);

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "spline",
        zoomType: "x",
        animation: true,
        panning: true,
        panKey: "shift",
      },
      title: { text: "" },
      xAxis: {
        type: "time",
        title: { text: "Seconds" },
        labels: {
          formatter: function () {
            return new Date(this.value).getSeconds();
          },
        },
      },
      yAxis: {
        title: { text: "Values" },
      },
      tooltip: {
        shared: true,
        crosshairs: true,
      },
      legend: {
        enabled: true,
        align: "right",
        verticalAlign: "top",
        layout: "horizontal",
      },
      plotOptions: {
        series: {
          turboThreshold: 0,
          animation: true,
          marker: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: "Actual",
          data: actualSeries,
          color: COLORS.actual_color,
        },
        {
          name: "Ideal",
          data: idealSeries,
          color: COLORS.ideal_color,
          dashStyle: "ShortDash",
        },
      ],
    }),
    [actualSeries, idealSeries]
  );

  const formatSignalName = (name: string) => {
    return name
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  return (
    <Box className="box scatter-graph" sx={{ mt: 1 }}>
      <Box className="scatter-graph-header">
        <p>{formatSignalName(signal)}</p>
      </Box>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        immutable
      />
    </Box>
  );
});

export default TimeseriesGraph;
