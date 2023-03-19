import "./App.css";
import { useState } from "react";
import SideNav from "./components/SideNav/SideNav";
import Home from "./components/Home/Home";
import Lights from "./components/Lights/Lights";
import Cameras from "./components/Cameras/Cameras";
import Sensors from "./components/Sensors/Sensors";
import Heating from "./components/Heating/Heating";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App({ signOut, user }) {
	const [furnaceTemp, setFurnaceTemp] = useState(50);
	return (
		<div>
			<Router>
				<div className='app prevent-select'>
					<SideNav logout={signOut} />
					<div className='app-main'>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/lights' element={<Lights/>} />
							<Route path='/cameras' element={<Cameras />} />
							<Route path='/sensors' element={<Sensors />} />
							<Route
								path='/heating'
								element={
									<Heating furnaceTemp={furnaceTemp} setFurnaceTemp={setFurnaceTemp} />
								}
							/>
						</Routes>
					</div>
				</div>
			</Router>
		</div>
	);
}

export default withAuthenticator(App);
