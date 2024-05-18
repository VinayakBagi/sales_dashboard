import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CHART_TYPE } from "../constants";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function LineChart({
  data,
  labelField,
  valueField,
  onDrillDown,
  handleLineChartDrillDown,
}) {
  const labels = [...new Set(data.map((d) => d[labelField]))];
  const chartData = {
    labels,
    datasets: [
      {
        label: `Sales by ${labelField}`,
        data: labels.map((label) =>
          data
            .filter((d) => d[labelField] === label)
            .reduce((sum, item) => sum + item[valueField], 0)
        ),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: labelField.charAt(0).toUpperCase() + labelField.slice(1),
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: valueField.charAt(0).toUpperCase() + valueField.slice(1),
        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0 && onDrillDown) {
        const index = elements[0].index;
        const label = labels[index];
        onDrillDown(labelField, valueField, label, CHART_TYPE.LINE);
      }
      if (elements.length > 0 && handleLineChartDrillDown) {
        const index = elements[0].index;
        const clickedDate = data[index][labelField];
        handleLineChartDrillDown(clickedDate);
      }
    },
  };

  return (
    <div className="chart">
      <h2>
        Sales by {labelField.charAt(0).toUpperCase() + labelField.slice(1)}
      </h2>
      <Line style={{ cursor: "pointer" }} data={chartData} options={options} />
    </div>
  );
}

export default LineChart;
