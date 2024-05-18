import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CHART_TYPE } from "../constants";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data, labelField, valueField, onDrillDown }) {
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
          "rgba(255,99,132,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
        ],
      },
    ],
  };

  const options = {
    onClick: (e, elements) => {
      if (elements.length > 0 && onDrillDown) {
        const index = elements[0].index;
        const label = labels[index];
        onDrillDown(labelField, valueField, label, CHART_TYPE.PIE);
      }
    },
  };

  return (
    <div className="chart">
      <h2>
        Sales by {labelField.charAt(0).toUpperCase() + labelField.slice(1)}
      </h2>
      <Pie data={chartData} style={{ cursor: "pointer" }} options={options} />
    </div>
  );
}

export default PieChart;
