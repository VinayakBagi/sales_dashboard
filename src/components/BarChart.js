import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CHART_TYPE } from "../constants";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function BarChart({ data, labelField, valueField, onDrillDown }) {
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
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(153,102,255,0.6)",
          "rgba(255,159,64,0.6)",
        ],
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
        onDrillDown(labelField, valueField, label, CHART_TYPE.BAR);
      }
    },
  };

  return (
    <div className="chart">
      <h2>
        Sales by {labelField.charAt(0).toUpperCase() + labelField.slice(1)}
      </h2>
      <Bar style={{ cursor: "pointer" }} data={chartData} options={options} />
    </div>
  );
}

export default BarChart;
