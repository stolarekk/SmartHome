import React from "react";
import "./BigTile.css";
import { useState } from "react";
import { IoThermometerOutline } from "react-icons/io5";

function BigHeatingTile(props) {
	
	return (
		<div className='big-tile'>
			<div className='big-tile-upper-row'>
				<IoThermometerOutline className='big-tile--icon big-tile--icon-temp' />
				<span className='big-tile--additional-text'>
					{props.additionalText}
				</span>
			</div>
			<div className='big-tile--column'>
				<span className='big-tile--text big-tile--text-bold'>	
					{props.upperText}
				</span>
				<span className='big-tile--text'>{props.bottomText}</span>
			</div>
		</div>
	);
}

export default BigHeatingTile;
