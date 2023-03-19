import React from "react";
import "./Home.css";
import TileLight from "../Tile/TileLight";
import TileTemp from "../Tile/TileTemp";
import SmallTile from "../SmallTile/SmallTile";
import BigDoorTile from "../BigTile/BigDoorTile";
import BigHeatingTile from "../BigTile/BigHeatingTile";
import {
	IoWater,
	IoBulb,
	IoLockClosed,
	IoLockOpen,
	IoThermometer,
	IoThermometerOutline,
	IoCloudDownloadSharp,
	IoLockClosedOutline,
	IoLockOpenOutline,
} from "react-icons/io5";
import axios from "axios";
import { useState, useEffect } from "react";

function Home() {
	const [cam0, changeFrame] = useState();
	const [temp1, changeTemp1] = useState(0);
	const [tempKitchen, changeTempKitchen] = useState(0);
	const [hum1, changeHum1] = useState(0);
	const [pressure, changePressure] = useState(0);
	const [currentTemp, setCurrentTemp] = useState(50);
	const [lamps, changeLamps] = useState({
		Lamp1: { r: 0, g: 0, b: 0, a: 0 },
		Lamp2: { r: 0, g: 0, b: 0, a: 0 },
		Lamp3: { r: 0, g: 0, b: 0, a: 0 },
		Lamp4: { r: 0, g: 0, b: 0, a: 0 },
		Lamp5: { r: 0, g: 0, b: 0, a: 0 },
		Lamp6: { r: 0, g: 0, b: 0, a: 0 },
		Lamp7: { r: 0, g: 0, b: 0, a: 0 },
	});
	const [lampState, changeLampState] = useState([0, 0, 0, 0, 0, 0, 0]);
	const [lights, changeLights] = useState(0);
	const [door, setDoor] = useState(false);

	useEffect(() => {
		async function fetchStates() {
			try {
				const res = await axios.get("http://localhost:3001/states");
				const fetched = res.data.states[0];
				changeHum1(fetched.humidity);
				changeTemp1(fetched.temperature);
				changeTempKitchen(fetched.temperatureKitchen);
				changePressure(Math.trunc(fetched.pressure / 100));
				
				changeLamps({
					Lamp1: {
						r: fetched.Lamp1.colorR,
						g: fetched.Lamp1.colorG,
						b: fetched.Lamp1.colorB,
						a: fetched.Lamp1.brightness,
					},
					Lamp2: {
						r: fetched.Lamp2.colorR,
						g: fetched.Lamp2.colorG,
						b: fetched.Lamp2.colorB,
						a: fetched.Lamp2.brightness,
					},
					Lamp3: {
						r: fetched.Lamp3.colorR,
						g: fetched.Lamp3.colorG,
						b: fetched.Lamp3.colorB,
						a: fetched.Lamp3.brightness,
					},
					Lamp4: {
						r: fetched.Lamp4.colorR,
						g: fetched.Lamp4.colorG,
						b: fetched.Lamp4.colorB,
						a: fetched.Lamp4.brightness,
					},
					Lamp5: {
						r: fetched.Lamp5.colorR,
						g: fetched.Lamp5.colorG,
						b: fetched.Lamp5.colorB,
						a: fetched.Lamp5.brightness,
					},
					Lamp6: {
						r: fetched.Lamp6.colorR,
						g: fetched.Lamp6.colorG,
						b: fetched.Lamp6.colorB,
						a: fetched.Lamp6.brightness,
					},
					Lamp7: {
						r: fetched.Lamp7.colorR,
						g: fetched.Lamp7.colorG,
						b: fetched.Lamp7.colorB,
						a: fetched.Lamp7.brightness,
					},
				});
				changeLampState([
					fetched.Lamp1.state,
					fetched.Lamp2.state,
					fetched.Lamp3.state,
					fetched.Lamp4.state,
					fetched.Lamp5.state,
					fetched.Lamp6.state,
					fetched.Lamp7.state,
				]);
				const lampsOn =
					fetched.Lamp1.state +
					fetched.Lamp2.state +
					fetched.Lamp3.state +
					fetched.Lamp4.state +
					fetched.Lamp5.state +
					fetched.Lamp6.state +
					fetched.Lamp7.state;
				changeLights(lampsOn);
			} catch (err) {}
		}
		async function getFurnaceTemp() {
			const date = new Date();
			const hour = date.getHours();
			try {
				const res = await axios.get("http://localhost:3001/furnace");
				const fetched = res.data.states[0];
				setCurrentTemp(fetched[hour]);
			} catch (e) {}
		}
		getFurnaceTemp();
		fetchStates();
	}, []);

	useEffect(() => {
		async function fetchCam0() {
			try {
				const res = await axios.get("http://localhost:3001/cam");
				changeFrame(res.data.cam0.data);
			} catch (err) {}
		}
		let interval = setInterval(() => {
			try {
				fetchCam0();
				const b64encoded = btoa(String.fromCharCode.apply(null, cam0));
				const datajpg = "data:image/jpg;base64," + b64encoded;
				if (b64encoded) {
					document.getElementById("cam0").src = datajpg;
					document.getElementById("cam1").src = datajpg;
				}
			} catch (error) {
				console.log("error: " + error);
			}
		}, 500);
		return () => {
			clearInterval(interval);
		};
	});

	return (
		<div className='appPage'>
			<h1 className='appPage-header'>My Home</h1>
			<div className='appPage-row--tiles'>
				<SmallTile
					icon={<IoWater className='smallTile-icon smallTile-icon-humidity' />}
					upperText='Humidity'
					bottomText={`${hum1}%`}
				/>
				<SmallTile
					icon={
						<IoThermometerOutline className='smallTile-icon smallTile-icon-temp' />
					}
					upperText='Temperature'
					bottomText='20-22°C'
				/>
				<SmallTile
					icon={
						<IoCloudDownloadSharp className='smallTile-icon smallTile-icon-pressure' />
					}
					upperText='Pressure'
					bottomText={`${pressure}Pa`}
				/>
				<SmallTile
					icon={<IoBulb className='smallTile-icon smallTile-icon-bulb' />}
					upperText='Lights'
					bottomText={`${lights} On`}
				/>
				<SmallTile
					icon={
						door ? (
							<IoLockClosed className='smallTile-icon smallTile-icon-locked' />
						) : (
							<IoLockOpen className='smallTile-icon smallTile-icon-unlocked' />
						)
					}
					upperText='Security'
					bottomText={`Doors ${door ? "locked" : "unlocked"}`}
				/>
			</div>

			<div className='appPage-row'>
				<h3 className='appPage-row--header'>Cameras {">"}</h3>
				<div className='appPage-row--cameras'>
					<img
						id='cam0'
						className='appPage-row--cam cam-left'
						src='/images/cam-offline.png'
					/>
					{/* <img
						id='cam1'
						className='appPage-row--cam cam-right'
						src='/images/cam-offline.png'
					/> */}
				</div>
			</div>

			<div className='appPage-row'>
				<h3 className='appPage-row--header'>Living Room {">"}</h3>
				<div className='appPage-row--tiles'>
					<TileLight
						lampIndex='1'
						text='Living room main'
						lights={changeLights}
						color={lamps.Lamp1}
						lampState={lampState[0]}
					/>
					<TileLight
						lampIndex='2'
						text='Living room pendant'
						lights={changeLights}
						color={lamps.Lamp2}
						lampState={lampState[1]}
					/>
					<TileLight
						lampIndex='3'
						text='Ceiling lights'
						lights={changeLights}
						color={lamps.Lamp3}
						lampState={lampState[2]}
					/>
					<TileTemp text='Sensor 1' temp={`${temp1}°C`} />
				</div>
			</div>

			<div className='appPage-row'>
				<h3 className='appPage-row--header'>Kitchen {">"}</h3>
				<div className='appPage-row--tiles'>
					<TileLight
						lampIndex='4'
						text='Kitchen main'
						lights={changeLights}
						color={lamps.Lamp4}
						lampState={lampState[3]}
					/>
					<TileLight
						lampIndex='5'
						text='Kitchen accent'
						lights={changeLights}
						color={lamps.Lamp5}
						lampState={lampState[4]}
					/>
					<TileTemp text='Sensor 2' temp={`${tempKitchen}°C`} />
				</div>
			</div>

			<div className='appPage-row'>
				<h3 className='appPage-row--header'>Bathroom {">"}</h3>
				<div className='appPage-row--tiles'>
					<TileLight
						lampIndex='6'
						text='Bathroom main'
						lights={changeLights}
						color={lamps.Lamp6}
						lampState={lampState[5]}
					/>
					<TileLight
						lampIndex='7'
						text='Bathroom mirror'
						lights={changeLights}
						color={lamps.Lamp7}
						lampState={lampState[6]}
					/>
					
					<TileTemp text='Sensor 3' temp='22°C' />
				</div>
				<div className='appPage-row'>
					<h3 className='appPage-row--header'>Others {">"}</h3>
					<div className='appPage-row--tiles'>
						<BigHeatingTile
							upperText='Heating control'
							additionalText={`${currentTemp}°C`}
							bottomText='Furnace temperature'
						/>
						<BigDoorTile upperText='Front door' door={door} setDoor={setDoor} />
					</div>
				</div>
			</div>
		</div>
	);
}
export default Home;
