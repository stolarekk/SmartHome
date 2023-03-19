import React from "react";
import { useState } from "react";
import "./Tile.css";
import { HiOutlineLightBulb, HiOutlineSun } from "react-icons/hi2";

function Tile(props) {
	return (
		<div className='tile'>
			<HiOutlineSun className='tile-icon' />
			<div className='tile-column'>
				<span className='tile-text'>{props.text}</span>
				<span className='tile-text'>{props.temp}</span>
			</div>
		</div>
	);
}

export default Tile;
