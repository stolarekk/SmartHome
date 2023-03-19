const awsIot = require("aws-iot-device-sdk");

const device = awsIot.device({
	clientId: "WebApp_nodejs",
	host: "a3kf7vaos58na-ats.iot.us-west-2.amazonaws.com",
	port: 8883,
	keyPath: "./mqtt/cert/nodejs-privatekey.pem.key",
	certPath: "./mqtt/cert/nodejs-certificate.pem.crt",
	caPath: "./mqtt/cert/nodejs-CA1.pem",
});

device.on("connect", function () {
	console.log("Connecting to AWS  IoT Core");
	console.log(
		`--------------------------------------------`
	);
});

const topicSub = "esp32/sensors";
const topicSubCam = "esp32/cam_0";
const topicLed = "esp32/lamp1";
const topicDoor = "esp32/door";
const topicFurnace = "nodejs/furnacetemps/calculate";
const topicFurnaceESP = "nodejs/furnacetemps/updateesp32";
const topicSensors = "esp32/sensors";

device.on("message", function (topic, payload) {
	if (topic === topicSubCam) {
		const frame = payload;
		module.exports.frame = frame;
	}
});

device.on("error", function (topic, payload) {
	console.log("Error:", topic, payload.toString());
});

device.subscribe(topicSub);
device.subscribe(topicSubCam);

module.exports.device = device;
module.exports.topicLed = topicLed;
module.exports.topicDoor = topicDoor;
module.exports.topicFurnace = topicFurnace;
module.exports.topicFurnaceESP = topicFurnaceESP;
module.exports.topicSensors = topicSensors;
