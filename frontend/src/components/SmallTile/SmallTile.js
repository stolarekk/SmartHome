import React from "react";
import "./SmallTile.css";
function SmallTile(props) {
	return (
		<div className='smallTile'>
			{props.icon}
			<div className='tile-column'>
				<span className='smallTile-text smallTile-text--bold'>{props.upperText}</span>
				<span className='smallTile-text'>{props.bottomText}</span>
			</div>
		</div>
	);
}

export default SmallTile;
