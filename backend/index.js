const express = require("express");
const app = express();
const config = require("./config");
const mqtt = require("./mqtt/mqtt.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const DynamoDB = require("./aws-dynamoDB/dynamo.js");

app.get("/", function (req, res) {
	res.send(`Serwer działa`);
});
app.use(cors());
app.use(bodyParser.json());

app.get("/cam", (req, res) => {
	res.send({
		cam0: mqtt.frame,
	});
});

app.get("/states", (req, res) => {
	DynamoDB.getStates(req, res);
	//DynamoDB.getPresenceData(req,res);
});

app.get("/sensors", (req, res) => {
	DynamoDB.getSensorsData(req, res);
});

app.get("/presence", (req, res) => {
	DynamoDB.getPresenceData(req,res);
});

app.post("/api", (req, res) => {
	const msg = req.body.msg;
	res.sendStatus(201);
});

app.post("/led", (req, res) => {
	const colors = {
		lampIndex: req.body.lampIndex,
		colorR: req.body.colorR,
		colorG: req.body.colorG,
		colorB: req.body.colorB,
		brightness: req.body.brightness,
		state: req.body.state
	};
	DynamoDB.updateLamps(colors);
	mqtt.device.publish(mqtt.topicLed, JSON.stringify(colors));
	res.sendStatus(201);
});


app.post("/door", (req, res) => {
	mqtt.device.publish(mqtt.topicDoor, JSON.stringify(req.body));
	res.sendStatus(201);
});

app.get("/furnace", (req, res) => {
	DynamoDB.getFurnaceData(req, res);
});

app.post("/furnace", (req, res) => {
	mqtt.device.publish(mqtt.topicFurnace, JSON.stringify(req.body));
	mqtt.device.publish(mqtt.topicSensors, JSON.stringify(req.body));
	res.sendStatus(201);
});

app.post("/furnace/esp32", (req, res) => {
	mqtt.device.publish(mqtt.topicFurnaceESP, JSON.stringify(req.body));
	res.sendStatus(201);
});


app.listen(config.port, function () {
	console.log(`serwer słucha http://localhost:${config.port}`);
});
