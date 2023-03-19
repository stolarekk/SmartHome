import React, { useEffect } from "react";
import { useState } from "react";
import "./Tile.css";
import { HiOutlineLightBulb, HiXMark } from "react-icons/hi2";
import axios from "axios";
import { useLongPress } from "use-long-press";
import { RgbaColorPicker } from "react-colorful";

function Tile(props) {
	const [btn, setBtn] = useState();
	const [color, setColor] = useState({ r: 0, g: 0, b: 0, a: 0 });
	const [lastColor, setLastColor] = useState(color);
	const [colorPicker, showColorPicker] = useState();
	const longPress = useLongPress(() => showColorPicker(true), {
		filterEvents: event => true, // All events can potentially trigger long press
		threshold: 300,
		captureEvent: true,
		cancelOnMovement: false,
		detect: "both",
	});

	async function sendColors(lampState) {
		if (lampState) {
			const data = {
				lampIndex: props.lampIndex,
				colorR: color.r,
				colorG: color.g,
				colorB: color.b,
				brightness: color.a,
				state: 1,
			};
			const res = axios.post("http://localhost:3001/led", data);
		} else {
			const data = {
				lampIndex: props.lampIndex,
				colorR: color.r,
				colorG: color.g,
				colorB: color.b,
				brightness: color.a,
				state: 0,
			};
			const res = axios.post("http://localhost:3001/led", data);
		}
	}

	const changeBtnState = () => {
		setBtn(!btn);
		if (!btn) sendColors(true);
		else sendColors(false);
	};

	const changeColorPickerState = () => {
		showColorPicker(false);
		if (lastColor !== color) {
			if (btn) sendColors(true);
			else sendColors(false);
			setLastColor(color);
		}
	};

	function changeLightsfunction() {
		if (btn) {
			props.lights(lights => lights - 1);
		} else {
			props.lights(lights => lights + 1);
		}
	}

	useEffect(() => {
		setColor(props.color);
		if (props.lampState == 0) {
			setBtn(false);
		} else {
			setBtn(true);
		}
	}, [props.color]);

	return (
		<div>
			<div
				onClick={() => {
					changeBtnState();
					changeLightsfunction();
				}}
				{...longPress()}
				className='tile'>
				<HiOutlineLightBulb
					className={`tile-icon ${btn ? "tile-icon--bulb-on" : null}`}
				/>

				<div className='tile-column'>
					<span className='tile-text'>{props.text}</span>
					<span
						className={`tile-text ${btn ? "tile-text--on" : "tile-text--off"}`}>
						{btn ? `${Math.round(color.a * 100)}%` : "OFF"}
					</span>
				</div>
			</div>
			{colorPicker ? (
				<>
					<div className='colorPicker'>
						<button
							className='colorPicker-btnClose'
							onClick={() => showColorPicker(false)}>
							<HiXMark className='colorPicker-btnIcon' />
						</button>
						<RgbaColorPicker color={color} onChange={setColor} />
						<button
							onClick={changeColorPickerState}
							className='colorPicker-btn'>
							Set color
						</button>
					</div>
					<div
						className='colorPicker-background'
						onClick={() => showColorPicker(false)}></div>
				</>
			) : null}
		</div>
	);
}

export default Tile;
