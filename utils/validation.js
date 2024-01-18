var aesjs = require('aes-js');

var isRealString = (str) => {

	return typeof str === 'string' && str.trim().length > 0;
};

/* Distance between two lat/lng coordinates in km using the Haversine formula */
function getDistanceFromLatLng(lat1, lng1, lat2, lng2, miles) { // miles optional
	if (typeof miles === "undefined") { miles = false; }
	function deg2rad(deg) { return deg * (Math.PI / 180); }
	function square(x) { return Math.pow(x, 2); }
	var r = 6371; // radius of the earth in km
	lat1 = deg2rad(lat1);
	lat2 = deg2rad(lat2);
	var lat_dif = lat2 - lat1;
	var lng_dif = deg2rad(lng2 - lng1);
	var a = square(Math.sin(lat_dif / 2)) + Math.cos(lat1) * Math.cos(lat2) * square(Math.sin(lng_dif / 2));
	var d = 2 * r * Math.asin(Math.sqrt(a));
	if (miles) { return d * 0.621371; } //return miles
	else { return d; } //return km
}

const KEY_256 = [
	340,
	341,
	342,
	343,
	344,
	345,
	346,
	347,
	348,
	349,
	350,
	351,
	352,
	353,
	354,
	355,
	356,
	357,
	358,
	359,
	360,
	361,
	362,
	363,
	364,
	365,
	366,
	367,
	368,
	369,
	360,
	371
];

const initializationVector = [
	31,
	32,
	33,
	34,
	35,
	36,
	37,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	46
];
const keys = { KEY_256, initializationVector }

const KEY_256_BUFFER = new Uint8Array(keys.KEY_256);

const encryptData = function (text) {
	const textBytes = aesjs.utils.utf8.toBytes(text);
	const aesCbc = new aesjs.ModeOfOperation.ofb(
		KEY_256_BUFFER,
		keys.initializationVector,
	);
	const encryptedBytes = aesCbc.encrypt(textBytes);
	const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	return encryptedHex;
};

const decryptData = function (value) {
	var encryptedBytes = aesjs.utils.hex.toBytes(value);
	var aesOfb = new aesjs.ModeOfOperation.ofb(
		KEY_256_BUFFER,
		keys.initializationVector,
	);
	var decryptedBytes = aesOfb.decrypt(encryptedBytes);

	// Convert our bytes back into text
	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
	return decryptedText;
};

module.exports = {
	isRealString,
	getDistanceFromLatLng,
	encryptData,
	decryptData
};