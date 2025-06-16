import Box from "@mui/material/Box";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import "highcharts/modules/boost";
import { ChartNoAxesCombined, Square } from "lucide-react";
import { memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setTimeSeriesData } from "../reducers/mainSlice";
import { getTimeseriesData } from "../services/scatterData";
import type { RootState } from "../store/store";
import {
  Anomaly,
  type AxisValueType,
  type ChangeLogEntry,
  type ScatterPlotDataType,
  type ScatterPlotType,
  type TimeSeriesDataType,
} from "../types/ScatterData";
import { COLORS } from "../utils/Colors";

const tempCycleLogId = {
  red: 89280,
  green: 88362,
  black: 89152,
};

const legends = [
  {
    id: 1,
    text: "Cycle Anomaly : False",
    icon: <Square fill="#28a745" color="#28a745" size={10} />,
  },
  {
    id: 2,
    text: "Cycle Anomaly : True",
    icon: <Square fill="#dc3545" color="#dc3545" size={10} />,
  },
  {
    id: 3,
    text: "Cycle Anomaly : Null",
    icon: <Square fill="#4b4b4b" color="#4b4b4b" size={10} />,
  },
  {
    id: 4,
    text: "Sequence Anomaly : Null",
    icon: <Square fill="#1a1a1a" color="#1a1a1a" size={10} />,
  },
  {
    id: 5,
    text: "Threshold",
    icon: <ChartNoAxesCombined fill="#ff815b" color="#ff815b" size={10} />,
  },
];

const ScatterPlotGraph = memo(
  ({ scatterPlotData, thresholds, signal }: ScatterPlotType) => {
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

      return (
        logWithIdealSignal?.learned_parameters[sequence]?.average_list || []
      );
    };

    const formatTimeSeriesData = (
      timeseriesResponse: TimeSeriesDataType,
      anomaly: Anomaly,
      signal: string
    ) => {
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
      }

      if (timeseriesResponse?.data?.[cycle_log_id]?.cycle_data?.[signal]) {
        Object.entries(
          timeseriesResponse.data[cycle_log_id].cycle_data[signal]
        ).forEach(([time, value]) => {
          timeRange.push(parseFloat(time));
          actualSignals.push(value);
        });
      }

      return { timeRange, actualSignals };
    };

    const dataPointClickHandler = async (event) => {
      const point = event.point;

      let pointData: AxisValueType | undefined = null;

      Object.values(scatterPlotData).forEach((dataArr: AxisValueType[]) => {
        dataArr.find((pointObj) => {
          if (pointObj.x === point.key) {
            pointData = pointObj;
          }
        });
      });

      const { cycle_log_id, anomaly, start_time } = pointData;

      dispatch(setLoading(true));

      const idealSignals = fetchIdealSignals(
        changeLogsSnapshot,
        start_time,
        toolSequenceSnapshot
      );

      const timeseriesResponse = await getTimeseriesData(
        machineIdSnapshot,
        cycle_log_id.toString(),
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

    const thresholdSeries = useMemo(
      () =>
        thresholds?.map(({ x1, x2, y }) => ({
          type: "line",
          name: "Threshold",
          data: [
            [x1, y],
            [x2, y],
          ],
          color: COLORS.threshold,
          enableMouseTracking: false,
          linkedTo: null,
          showInLegend: false,
          marker: { enabled: false },
        })),
      [thresholds]
    );

    const formatSeriesData = (scatterPlotData: ScatterPlotDataType) => {
      const allData = [];

      // Calculating minY and maxY for Y axis range for optimization in boot mode
      let minY = 0;
      let maxY = 0;
      // This could have been done in ScatterData page in formatPredictionData function to adapt to highchart implementation
      // Or the raw data from ScatterData can be passed to this component and the formatting could have been done here
      scatterPlotData?.anomalyFalseData?.forEach((d) => {
        const y = parseFloat(d.y.toFixed(3));
        if (minY > y) {
          minY = y;
        }
        if (maxY < y) {
          maxY = y;
        }
        allData.push({
          x: d.x,
          y,
          color: COLORS.anomaly_false,
        });
      });

      scatterPlotData?.anomalyTrueData?.forEach((d) => {
        const y = parseFloat(d.y.toFixed(3));
        if (minY > y) {
          minY = y;
        }
        if (maxY < y) {
          maxY = y;
        }
        allData.push({
          x: d.x,
          y,
          color: COLORS.anomaly_true,
          marker: { symbol: "diamond" },
        });
      });

      scatterPlotData?.anomalyNullData?.forEach((d) => {
        const y = parseFloat(d.y.toFixed(3));
        if (minY > y) {
          minY = y;
        }
        if (maxY < y) {
          maxY = y;
        }
        allData.push({
          x: d.x,
          y,
          color: COLORS.sequence_null,
          marker: { symbol: "triangle" },
        });
      });

      return { allData, minY, maxY };
    };

    const { allData, minY, maxY } = useMemo(
      () => formatSeriesData(scatterPlotData),
      [scatterPlotData]
    );

    const series = useMemo(() => {
      return [
        ...thresholdSeries,
        {
          type: "scatter",
          name: "Scatter Data",
          showInLegend: false,
          data: allData,
          turboThreshold: 0, // It is used for number or array of numbers, It is not recommended for complex objects
          boostThreshold: 10, // Setting threshold to 10 to prevent the change of color of data points to default color when zooming in
          allowPointSelect: true,
          point: {
            events: {
              click: dataPointClickHandler,
            },
          },
          enableMouseTracking: true,
        },
      ];
    }, [scatterPlotData]);

    const options = useMemo(
      () => ({
        chart: {
          zooming: {
            type: "xy",
            mouseWheel: {
              sensitivity: 1.2,
            },
          },
          animation: true,
          panning: {
            enabled: true,
            type: "xy",
          },
          panKey: "shift",
        },
        boost: {
          useGPUTranslations: false,
        },
        title: { text: "" },
        xAxis: {
          type: "datetime",
          title: { text: "Time" },
        },
        yAxis: {
          title: { text: "Values" },
          min: minY, // Set the min explicitly to prevent computing by the graph which leds to bug
          max: maxY, // Same for max, get the min and max from the scatter data
          events: {
            afterSetExtremes: function () {
              // const chart = this.chart;
              // chart.yAxis[0].setExtremes(e.dataMin - 200, 1000);
              // Setting extremes higher point to a fixed 1000 point or e.dataMax, is to keep the Y axis range constant
              // otherwise the Y axis range does not comes back to the original range when zooming out and gets stuck at around 400 or mid value
              // NEW SOLUTION: Instead of settig the min and max in scroll, set explicity in the Y and X axis
            },
          },
        },
        tooltip: {
          pointFormat:
            "<b>x : {point.x:%e %b %Y %H:%M:%S}</b><br/>y : {point.y}",
        },
        series,
      }),
      [series]
    );

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
        <HighchartsReact highcharts={Highcharts} options={options} immutable />
      </Box>
    );
  }
);

export default ScatterPlotGraph;
