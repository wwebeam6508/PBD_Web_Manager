import React from "react";
import ReactApexChart from "react-apexcharts";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ReactApexChart
        options={this.props.chartOptions}
        series={this.props.chartData}
        type={this.props.chartType}
        width="100%"
        height="100%"
      />
    );
  }
}

export default LineChart;
