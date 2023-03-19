import React from "react";
import "../Home/Home.css";
import "./Cameras.css";
import axios from "axios";
import { useState, useEffect } from "react";

function Cameras() {
	const [cam0, changeFrame] = useState();

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
			<h1 className='appPage-header'>Cameras</h1>

			<div className='appPage-row'>
				<div className='appPage-row--cameras'>
					<img
						id='cam0'
						className='appPage-row--cam-big cam-left'
						src='/images/cam-offline.png'
					/>
					
				</div>
			</div>
		</div>
	);
}
export default Cameras;
