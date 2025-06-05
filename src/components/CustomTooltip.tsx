import { GraphType, type ToolTipPropType } from "../types/ScatterData";

const CustomTooltip = ({
  active,
  payload,
  type = GraphType.GRAPH1,
}: ToolTipPropType) => {
  if (active && payload && payload.length) {
    if (type === GraphType.GRAPH2) {
      const payloadData = payload[0].payload;
      const time = payloadData.time;
      const actual = parseFloat(payloadData.actual);
      const ideal = parseFloat(payloadData.ideal);

      return (
        <div className="tooltip-wrapper">
          <p className="tooltip-txt">Time : {time}s </p>
          <p className="tooltip-txt">Actual : {actual.toFixed(2)} </p>
          <p className="tooltip-txt">Ideal : {ideal.toFixed(2)} </p>
        </div>
      );
    } else {
      const time = payload[0];
      const value = payload[1];
      const id = time.payload.id;

      const formattedDate = new Date(time.value as number).toDateString();

      const formattedValue = Number(value.value).toFixed(2);

      return (
        <div className="tooltip-wrapper">
          <p className="tooltip-txt">ID : {id} </p>
          <p className="tooltip-txt">Time : {formattedDate} </p>
          <p className="tooltip-txt">Value : {formattedValue} </p>
        </div>
      );
    }
  }
  return null;
};

export default CustomTooltip;
