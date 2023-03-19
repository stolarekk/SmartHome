import React, { useEffect } from "react";
import axios from "axios";
import "./BigTile.css";
import { useState } from "react";
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";

function BigDoorTile(props) {

	async function sendDoorState(val) {
			
		const res = axios.post("http://localhost:3001/door", {
			door: val
		});
	}

	const changeDoorState = () => {
		props.setDoor(!props.door);
		if (!props.door) sendDoorState(true);
		else sendDoorState(false);
	};

	return (
		<div className='big-tile' onClick={() => changeDoorState()}>
			<div className='big-tile-upper-row'>
				{props.door ? (
					<IoLockClosedOutline className='big-tile--icon big-tile--icon-locked' />
				) : (
					<IoLockOpenOutline className='big-tile--icon big-tile--icon-unlocked' />
				)}
			</div>
			<div className='big-tile--column'>
				<span className='big-tile--text big-tile--text-bold'>
					{props.upperText}
				</span>
				<span className='big-tile--text'>{props.door ? "Locked" : "Unlocked"}</span>
			</div>
		</div>
	);
}

export default BigDoorTile;
