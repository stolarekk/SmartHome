import React from "react";
import { Chart } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Spinner from "../Spinner/Spinner";
import { useState } from "react";
function LineChart({ chartData, title, xAxisTitle, yAxisTitle, reverse}) {
	const [isLoading, setIsLoading] = useState(true);
	const options = {
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		maintainAspectRatio: false,
		responsive: true,
		scales: {
			x: {
				reverse: reverse,
				grid: {
					display: true,
				},
				ticks: {
					align: "inner",
				},
				title: {
					display: true,
					text: xAxisTitle,
					color: "black",
				},
			},
			y: {
				grid: {
					display: true,
				},
				title: {
					display: true,
					text: yAxisTitle,
					color: "black",
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: title,
				padding: 8,
				font: {
					size: 14,
				},
			},
		},
	};

	return <>{chartData ? <Line data={chartData} options={options} /> : <Spinner/>}</>;
}
export default LineChart;
