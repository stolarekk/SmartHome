import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import TileLight from "../Tile/TileLight";

function Lights(props) {

	const [lights, changeLights] = useState(0);
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
    useEffect(() => {
		async function fetchStates() {
			try {
				const res = await axios.get("http://localhost:3001/states");
				const fetched = res.data.states[0];
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
			} catch (err) {}
		}
		
		fetchStates();
	}, []);
	return (
		<div className='appPage'>
			<h1 className='appPage-header'>Lights</h1>

			<div className='appPage-row'>
				<h3 className='appPage-row--header'>All lights in home {">"}</h3>
				<div className='appPage-row--tiles'>
                <div className='appPage-row'>
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
                    
				</div>
			</div></div></div>

			<div className='appPage-row'>
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
                     <TileLight
						lampIndex='6'
						text='Bathroom main'
						lights={changeLights}
						color={lamps.Lamp6}
						lampState={lampState[5]}
					/>
				</div>
			</div>

			<div className='appPage-row'>
				<div className='appPage-row--tiles'>
               
					<TileLight
						lampIndex='7'
						text='Bathroom mirror'
						lights={changeLights}
						color={lamps.Lamp7}
						lampState={lampState[6]}
					/>
					
				</div>
				</div>
			</div>
		
	);
}

export default Lights;
