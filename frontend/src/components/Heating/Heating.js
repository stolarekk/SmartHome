import React from "react";
import axios from "axios";
import "./Heating.css";
import { useState, useEffect } from "react";
import LineChart from "../Charts/LineChart";

function Heating() {
	const [presenceData, setPresenceData] = useState();
	const [furnaceSchedule, setFurnaceSchedule] = useState();
	const [minTempInput, setMinTempInput] = useState(50);
	const [maxTempInput, setMaxTempInput] = useState(70);
	const [currentTemp, setCurrentTemp] = useState(50);
	const [editBtnClass, setEditBtnClass] = useState("edit-btn");
	const [editMode, setEditMode] = useState(false);

	async function getFurnaceData() {
		const date = new Date();
		const hour = date.getHours();
		try {
			const res = await axios.get("http://localhost:3001/furnace");
			const fetched = res.data.states[0];
			setCurrentTemp(fetched[hour]);
			let labels = fetched;
			delete labels.weekDay;
			labels = Object.keys(labels);
			let dataset = fetched;
			delete dataset.weekDay;
			dataset = Object.values(dataset);
			const chartParams = {
				labels: labels,
				datasets: [
					{
						borderColor: "rgb(0, 148, 95)",
						data: dataset,
						pointStyle: false,
						fill: { target: "origin", above: "rgba(0, 148, 95, 0.2" },
					},
				],
			};
			setFurnaceSchedule(chartParams);
		} catch (err) {}
	}

	async function getFurnaceMinMaxTemp() {
		try {
			const res = await axios.get("http://localhost:3001/states");
			const fetched = res.data.states[0];
			setMinTempInput(fetched.minTemp);
			setMaxTempInput(fetched.maxTemp);
		} catch (err) {}
	}

	async function changeFurnaceMinMaxTemp(minTemp, maxTemp) {
		if (minTemp > 0 && maxTemp > 0 && maxTemp > minTemp) {
			try {
				const res = await axios.post("http://localhost:3001/furnace", {
					deviceId: "nodejs",
					minTemp: minTemp,
					maxTemp: maxTemp,
				});
			} catch (err) {}
		}
	}
	async function updateESP() {
			try {
				const res = await axios.post("http://localhost:3001/furnace/esp32", {
					request: 'update furnace temp'
				});
			} catch (err) {}
		
	}

	async function fetchPresenceData() {
		try {
			const res = await axios.get("http://localhost:3001/presence");
			const fetched = res.data.states[0];
			let labels = fetched;
			delete labels.weekDay;
			delete labels.timestamp;
			labels = Object.keys(labels);
			let dataset = fetched;
			delete dataset.weekDay;
			delete dataset.timestamp;
			dataset = Object.values(dataset);
			// const analysedData = dataset.map(function (val, index, arr) {
			// 	if (index === 0) {
			// 		return 50 + ((val + arr[index + 1]) / 2 / 60) * 20;
			// 	} else if (index === 23) {
			// 		return 50 + ((val + arr[index - 1]) / 2 / 60) * 20;
			// 	} else
			// 		return 50 + ((arr[index - 1] + val + arr[index + 1]) / 3 / 60) * 20;
			// // });
			// console.log(analysedData);
			const chartParams = {
				labels: labels,
				datasets: [
					{
						borderColor: "rgb(255, 148, 95)",
						data: dataset,
						pointStyle: false,
						fill: { target: "origin", above: "rgba(255, 148, 95, 0.2" },
					},
				],
			};
			setPresenceData(chartParams);
		} catch (err) {}
	}

	useEffect(() => {
		fetchPresenceData();
		getFurnaceData();
		getFurnaceMinMaxTemp();
	}, []);

	const delay = ms => new Promise(res => setTimeout(res, ms));

	async function saveTemps() {
		changeFurnaceMinMaxTemp(minTempInput, maxTempInput);
		setEditMode(false);
		setFurnaceSchedule();
		await delay(3000);
		getFurnaceData();
		updateESP();

	}

	return (
		<div className='appPage'>
			<h1 className='appPage-header'>Heating Central</h1>
			<div className='appPage-row--charts'>
				<div className='chart'>
					<LineChart
						chartData={presenceData}
						title='Presence at home'
						xAxisTitle='Hour of day'
						yAxisTitle='Number of detected presences'
					/>
				</div>

				<div className='chart'>
					<LineChart
						chartData={furnaceSchedule}
						title='Furnace temperature during day'
						xAxisTitle='Hour of day'
						yAxisTitle='Furnace temperature [°C]'
					/>
				</div>
			</div>
			<div
				className='heating-temp-container'
				onMouseEnter={() => setEditBtnClass("edit-btn visible")}
				onMouseLeave={() => setEditBtnClass("edit-btn")}>
				<h3 className='heating-temp-header'>Furnace temperature:</h3>
				<p className='heating-temp-details'>Current: {currentTemp}°C</p>
				<p className='heating-temp-details'>
					Minimum:{" "}
					{editMode ? (
						<input className='heating-temp-input' type='number' placeholder='minTemp'
							min={0} max={90} value={minTempInput} onChange={e => setMinTempInput(e.target.value)}/>
					) : (
						`${minTempInput}`
					)}°C
				</p>
				<p className='heating-temp-details'>
					Maximum:{" "}
					{editMode ? (
						<input className='heating-temp-input' type='number' placeholder='maxTemp'
							min={0} max={90} value={maxTempInput} onChange={e => setMaxTempInput(e.target.value)}
						/>
					) : (
						`${maxTempInput}`
					)} °C
				</p>
				{editMode ? (
					<button className={editBtnClass} onClick={saveTemps}> SAVE </button>
				) : (
					<button className={editBtnClass} onClick={() => setEditMode(true)}> EDIT </button>
				)}
			</div>
			<div></div>
		</div>
	);
}

export default Heating;
