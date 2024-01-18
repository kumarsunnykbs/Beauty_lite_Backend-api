"user strict";
var sql = require("./db.js");
var dbFunc = require("./db-functions.js");

// var BlockToCoinModel = require("../model/blockToCoinModel.js");

const bcrypt = require("bcrypt");
let config = require("../../config");
var request = require("request");
const saltRounds = 10;
const Cryptr = require("cryptr");
const cryptr = new Cryptr("uzythSecure22v");

var speakeasy = require("speakeasy");
var QRCode = require("qrcode");

var mergeArray = require("merge-array");
var langJson = require("./lang.json");
var WAValidator = require("wallet-address-validator");
//Task object constructor
var groupArray = require("group-array");
bcypher = require("blockcypher");

/**** XRP(Ripple) Setting*****/
const RippleAPI = require("ripple-lib").RippleAPI;
const xrpapi = new RippleAPI({
  server: "wss://s1.ripple.com:443", //wss://s1.ripple.com:443'//'wss://s.devnet.rippletest.net:51233'//wss://s.\
});
xrpapi.on("error", function (errorCode, errorMessage) {
  console.log("xrpapi", errorCode + ": " + errorMessage);
});
xrpapi.connect();
var myAddress = ""; /* Balance 1000 XRP*/
var mySecret = "";
var coinInUSD = 0.1; //04022021
var exchange_unlock = 1;
var fullAmountused = 15; /* only 93% amount usable*/

const blockUrl = "https://api.blockcypher.com/v1/";
const blockcypherToken = "";
const multiplierBTC = 100000000;

var totalBalanceCompress = 0; /* 5% */
var bcapi = new bcypher("btc", "main", "");
var oneTOKEN = 5;

// var Transaction = require("../model/transactionModel.js");

//var oneUZVal =  1; //6.8; 12102020 // USD VALUE
var oneUZVal = 0.1;
var miniTradeval = 10;
var maxTradeval = 1000;

function printResponse(err, data) {
  if (err !== null) {
    console.log("printResponse", err);
  } else {
    console.log("printResponse", data);
  }
}

//xrprun().catch(error => console.error(error.stack));

const Coinpayments = require("coinpayments");
var options = {
  key: "",
  secret: "",
};
const client = new Coinpayments(options);

var Exchange = function (userData) {
  console.log(userData);
  this.username = userData.username;
  this.created_at = new Date();
};

Exchange.getNfthistory = function (result) {
  var data = {};
  sql.query(
    "Select nft_history.id, nft_history.address, nft_history.amount, nft_history.created_at, nft_details.nft_id, nft_details.item_type, nft_history.item_label FROM nft_history LEFT JOIN nft_details ON nft_details.id = nft_history.item_id WHERE nft_history.is_deleted='0'",
    function (err, rows) {
      if (err) {
        console.log(err);
        data["error"] = true;
        data["msg"] = err.code;
        data["body"] = [];
        dbFunc.connectionRelease;
        result(null, data);
      } else {
        console.log(this.sql);
        data["error"] = false;
        data["msg"] = "Success";
        data["body"] = rows;
        dbFunc.connectionRelease;
        result(null, data);
      }
    }
  );
};

module.exports = Exchange;
