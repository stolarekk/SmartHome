import React from "react";
import "../Home/Home.css";
import "./Sensors.css";
import axios from "axios";
import { useState, useEffect } from "react";
import LineChart from "../Charts/LineChart";

function Sensors() {
	const [sensor1Data1, setSensor1Data1] = useState();
	const [sensor1Data2, setSensor1Data2] = useState();
	const [sensor2Data1, setSensor2Data1] = useState();
	const [sensor2Data2, setSensor2Data2] = useState();

	async function fetchStates(deviceId, dataType) {
		try {
			const date = new Date();
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();
			const currentTimestamp = new Date(`${year}.${"01"}.${"23"}`).getTime();
			const res = await axios.get("http://localhost:3001/sensors", {
				params: { deviceId: deviceId, timestamp: currentTimestamp },
			});
			const fetched = res.data.states;
			console.log(res)
			let dataset;
			let chartColor;
			let fillColor;
			if (dataType === "temperature") {
				dataset = fetched.map(data => data.temperature);
				chartColor = "rgb(255, 148, 95)";
				fillColor = "rgba(255, 148, 95, 0.2";
			} else if (dataType === "humidity") {
				dataset = fetched.map(data => data.humidity);
				chartColor = "rgb(116, 203, 244)";
				fillColor = "rgba(116, 203, 244, 0.2)";
			} else if (dataType === "pressure") {
				dataset = fetched.map(data => data.pressure);
				chartColor = "rgb(147, 225, 0)";
				fillColor = "rgba(147, 225, 0, 0.2)";
			} else return "Wrong dataType parameter";
			const chartParams = {
				labels: fetched.map(data => {
					const date = new Date(data.timestamp);
					const minutes =
						date.getMinutes() <= 9
							? `0${date.getMinutes()}`
							: date.getMinutes();
					const hours =
						date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();
					const dateString = hours + ":" + minutes;
					return dateString;
				}),
				datasets: [
					{
						label: `${dataType}`,
						borderColor: chartColor,
						data: dataset,
						pointStyle: false,
						fill: { target: "origin", above: fillColor },
					},
				],
			};
			if (deviceId === "esp32") {
				if (!dataType) {
					setSensor1Data1(chartParams);
				} else if (dataType === "temperature") setSensor1Data1(chartParams);
				else if (dataType === "humidity") setSensor1Data2(chartParams);
			} else if (deviceId === "esp8266") {
				if (dataType === "temperature") setSensor2Data1(chartParams);
				else if (dataType === "pressure") {
					setSensor2Data2(chartParams);
				}
			}
		} catch (err) {}
	}

	useEffect(() => {
		fetchStates("esp32", "temperature");
		fetchStates("esp32", "humidity");
		fetchStates("esp8266", "temperature");
		fetchStates("esp8266", "pressure");
	}, []);
	return (
		<div className='appPage'>
			<h1 className='appPage-header'>Sensors</h1>
			<h3 className='appPage-row--header'>Living Room {">"}</h3>
			<div className='appPage-row--charts'>
				<div className='chart'>
					<LineChart chartData={sensor1Data1} title='Living room temperature' xAxisTitle='Time' yAxisTitle='Temperature [°C]' reverse={true}/>
				</div>
				<div className='chart'>
					<LineChart chartData={sensor1Data2} title='Living room humidity' xAxisTitle='Time' yAxisTitle='Humidity [%]' reverse={true}/>
				</div>
			</div>
			<h3 className='appPage-row--header'>Kitchen {">"}</h3>
			<div className='appPage-row--charts'>
				<div className='chart'>
					<LineChart chartData={sensor2Data1} title='Kitchen temperature' xAxisTitle='Time' yAxisTitle='Temperature [°C]' reverse={true}/>
				</div>
				<div className='chart'>
					<LineChart chartData={sensor2Data2} title='Kitchen pressure' xAxisTitle='Time' yAxisTitle='Pressure [Pa]' reverse={true}/>
				</div>
			</div>
		</div>
	);
}
export default Sensors;
