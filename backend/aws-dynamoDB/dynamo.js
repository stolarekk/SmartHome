const { ImportExport } = require("aws-sdk");
const AWS = require("aws-sdk");
const config = require("./aws-config");

const getStates = async function (req, res) {
	AWS.config.update(config.aws_remote_config);

	const docClient = new AWS.DynamoDB.DocumentClient();
	const params = {
		TableName: config.aws_states_table_name,
	};
	docClient.scan(params, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			const { Items } = data;
			res.send({
				states: Items,
			});
		}
	});
};

const getSensorsData = async function (req, res) {
	AWS.config.update(config.aws_remote_config);
	const docClient = new AWS.DynamoDB.DocumentClient();
	const params = {
		TableName: config.aws_sensors_table_name,
		ExpressionAttributeValues: {
			":id": req.query.deviceId,
			":tstart": Number(req.query.timestamp),
			":tend": Number(req.query.timestamp) + 86400000,
		},
		ExpressionAttributeNames: {
			"#id": "deviceId",
			"#time": "timestamp",
		},
		KeyConditionExpression: "#id = :id and #time BETWEEN :tstart AND :tend ",
		ScanIndexForward: false,
	};
	docClient.query(params, function (err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			res.send({
				states: data.Items,
			});
		}
	});
};

const getPresenceData = async function (req, res) {
	AWS.config.update(config.aws_remote_config);
	const docClient = new AWS.DynamoDB.DocumentClient();
	const date = new Date();
	let day = date.getDay();
	if (day === 0) day = 7;
	const params = {
		TableName: config.aws_presence_table_name,
		ExpressionAttributeValues: {
			":weekDay": day
		},
		ExpressionAttributeNames: {
			"#weekDay": "weekDay",
		},
		KeyConditionExpression: "#weekDay = :weekDay",
		ScanIndexForward: false,
		Limit: 1,
	};
	docClient.query(params, function (err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			console.log(data.Items);
			res.send({
				states: data.Items,
			});
		}
	});
};

const getFurnaceData = async function (req, res) {
	AWS.config.update(config.aws_remote_config);
	const docClient = new AWS.DynamoDB.DocumentClient();
	const date = new Date();
	let day = date.getDay();
	if (day === 0) day = 7;
	const params = {
		TableName: config.aws_furnace_table_name,
		ExpressionAttributeValues: {
			":weekDay": day
		},
		ExpressionAttributeNames: {
			"#weekDay": "weekDay",
		},
		KeyConditionExpression: "#weekDay = :weekDay"
	};
	docClient.query(params, function (err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			console.log(data.Items);
			res.send({
				states: data.Items,
			});
		}
	});
};

const updateLamps = async function (colors) {
	AWS.config.update(config.aws_remote_config);

	const docClient = new AWS.DynamoDB.DocumentClient();
	const params = {
		TableName: config.aws_states_table_name,
		Key: { id: 0 },
		ProjectionExpression: "#i",
		ExpressionAttributeNames: { "#i": `Lamp${colors.lampIndex}` },
		UpdateExpression: "set #i = :i",
		ExpressionAttributeValues: {
			":i": colors,
		},
	};

	docClient.update(params, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log("lamps updated");
		}
	});
};

module.exports = {
	getStates,
	updateLamps,
	getPresenceData,
	getSensorsData,
	getFurnaceData
};

// const getPresenceData = async function (req, res) {
// 	AWS.config.update(config.aws_remote_config);

// 	const docClient = new AWS.DynamoDB.DocumentClient();
// 	//const timestamp = Date.now() - 3600*1000;
// 	const params = {
// 		TableName: config.aws_presence_table_name,
// 		ExpressionAttributeValues: {
// 			":presence": true,
// 			//":timestamp": timestamp
// 		},
// 		FilterExpression: "presenceDetected = :presence", //AND id > :timestamp",
// 		Limit: 30
// 	};
// 	docClient.scan(params, function (err, data) {
// 		if (err) {
// 			console.log("Error", err);
// 		} else {
// 			console.log("Success", data.Items);
// 		}
// 	});
// };

// const getSensorsData = async function (req, res) {
// 	AWS.config.update(config.aws_remote_config);

// 	const docClient = new AWS.DynamoDB.DocumentClient();
// 	const params = {
// 		TableName: config.aws_sensors_table_name,
// 		Limit: 30
// 	};
// 	docClient.scan(params, function (err, data) {
// 		if (err) {
// 			console.log("Error", err);
// 		} else {
// 			res.send({
// 				states: data.Items,
// 			});
// 		}
// 	});
// };