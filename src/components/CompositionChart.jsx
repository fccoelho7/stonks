import React, { useRef, useEffect } from "react";
import Chart from "chart.js";

const CompositionChart = ({ composition, style }) => {
  const chartCategoriesEl = useRef(null);

  useEffect(() => {
    new Chart(chartCategoriesEl.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: Object.values(composition),
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)"
            ]
          }
        ],
        labels: Object.keys(composition)
      },
      options: {
        responsive: true
      }
    });
  }, [composition]);

  return <canvas ref={chartCategoriesEl} height={100} style={style} />;
};

export default CompositionChart;
