"use strict";

var Auth = require("../model/authModel.js");
var langJson = require("./lang.json");
//console.log(langJson['sucess']['fr']);

//const translate = require('google-translate-api');
exports.register = function (req, res) {
  var userdata = req.body;
  var data = {};
  const ipInfo = req.ipInfo;
  var langPar = req.query;
  var lang = langPar.lang;
  var message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country}`;
  console.log(req.ip.replace("::ffff:", ""));
  var ip = req.ip.replace("::ffff:", "");
  //handles null error
  if (
    !userdata.username ||
    !userdata.birth_date ||
    !userdata.country ||
    !userdata.email ||
    !userdata.password
  ) {
    res.status(400).send({
      error: true,
      message: "Please provide Required information!",
      body: [],
    });
  } else {
    var postdata = {
      lang: lang,
      ip_address: ip,
      username: userdata.username,
      birth_date: userdata.birth_date,
      country: userdata.country,
      email: userdata.email,
      password: userdata.password,
      phone: userdata.phone,
      active: userdata.active,
    };
    console.log(postdata);
    Auth.register(postdata, function (err, response) {
      if (err) res.send(err);
      res.json(response);
    });
  }
};

exports.login = function (req, res) {
  var param = req.body;
  var langPar = req.query;
  param["lang"] = langPar.lang;
  var data = {};
  if (req.body && !!param.email && !!param.password) {
    Auth.login(param, function (err, response) {
      if (err) res.send(err);
      res.json(response);
    });
  } else {
    data["error"] = true;
    data["msg"] = "All field required";
    data["body"] = [];
    res.json(data);
  }
};
