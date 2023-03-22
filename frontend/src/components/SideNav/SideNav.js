import React from "react";
import { Link } from "react-router-dom";
import "./SideNav.css";
import { useLocation } from "react-router-dom";
import {
	HiOutlineLightBulb,
	HiOutlineHome,
	HiOutlineCamera,
	HiOutlinePresentationChartLine,
	HiOutlineSun,
	HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";
function SideNav(props) {
	const location = useLocation().pathname;
	return (
		<div className='sideNav'>
			<div className='sideNav-container'>
				<h2 className='sideNav-home'>Home</h2>
				<ul className='sideNav-list'>
					<Link className='link' to='/'>
						<li className={location === "/" ? "sideNav-list-active" : ""}>
							<HiOutlineHome className='sideNav-icon' /> <span className="sideNav-list-text">Home</span>
						</li>
					</Link>
					<Link className='link' to='/lights'>
						<li className={location === "/lights" ? "sideNav-list-active" : ""}>
							<HiOutlineLightBulb className='sideNav-icon' /> <span className="sideNav-list-text">Lights</span>
						</li>
					</Link>
					<Link className='link' to='/cameras'>
						<li
							className={location === "/cameras" ? "sideNav-list-active" : ""}>
							<HiOutlineCamera className='sideNav-icon' /> <span className="sideNav-list-text">Cameras</span>
						</li>
					</Link>
					<Link className='link' to='/sensors'>
						<li
							className={location === "/sensors" ? "sideNav-list-active" : ""}>
							<HiOutlinePresentationChartLine className='sideNav-icon' />{" "} <span className="sideNav-list-text">Sensors</span>
						</li>
					</Link>
					<Link className='link' to='/heating'>
						<li
							className={location === "/heating" ? "sideNav-list-active" : ""}>
							<HiOutlineSun className='sideNav-icon' /> <span className="sideNav-list-text">Heating Central</span>
						</li>
					</Link>
				</ul>
			</div>
			<ul className='sideNav-list'>
				<li className='logout' onClick={props.logout}>
					<HiOutlineArrowLeftOnRectangle className='sideNav-icon' /> <span className="sideNav-list-text">Logout</span>
				</li>
			</ul>
		</div>
	);
}

export default SideNav;
