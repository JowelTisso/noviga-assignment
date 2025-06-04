const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const time = payload[0];
    const value = payload[1];
    const id = time.payload.id;

    const formattedDate = new Date(time.value as number).toDateString();

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
};

export default CustomTooltip;
