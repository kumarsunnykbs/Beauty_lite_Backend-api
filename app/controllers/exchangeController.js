"use strict";

var User = require("../model/userModel.js");
// var Transaction = require("../model/transactionModel.js");
var Exchange = require("../model/exchangeModel.js");
var jwtMiddleware = require("./jwtMiddleware.js");

exports.getNfthistory = function (req, res) {
  Exchange.getNfthistory(function (err, response) {
    if (err) res.send(err);
    res.json(response);
  });
};
