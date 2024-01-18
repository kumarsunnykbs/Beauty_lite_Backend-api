"use strict";

var User = require("../model/userModel.js");
var Auth = require("../model/authModel.js");
var jwtMiddleware = require("./jwtMiddleware.js");
var langJson = require("./lang.json");
const fs = require("fs");
const AWS = require("aws-sdk");
// const { aWSCredentials } = require("../../utils/message")
// const USER_KEY = aWSCredentials.Access_Key; //'AKIATUGJAROHMYRTMSFC';
//const USER_SECRET = 'yDEQMEsvlms0Ls3PccdnBb1PBGlJIshkjAevYTLh/L';
// const USER_SECRET = aWSCredentials.Secret_Key; //'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';
// const BUCKET_NAME = aWSCredentials.Bucket; //'uzyth';

// let s3bucket = new AWS.S3({
//   accessKeyId: USER_KEY,
//   secretAccessKey: USER_SECRET,
//   Bucket: BUCKET_NAME,
// });

exports.getDashboardStats = function (req, res) {
  // var data = {};
  // var param = req.params;
  User.getDashboardStats(function (err, response) {
    if (err) response.send(err);
    res.json(response);
  });
};

exports.getallnft = function (req, res) {
  var data = {};
  var param = req.body;
  User.getallnft(param, function (err, response) {
      if (err)
          response.send(err);
      res.json(response);
  });

}

exports.addWalletHistory = function (req, res) {
  var param = req.body;
  User.addWalletHistory(param,function (err, response) {
      if (err)
          response.send(err);
      res.json(response);
  });

}
