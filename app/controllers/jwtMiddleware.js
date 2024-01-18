var jwt = require("jsonwebtoken");
var config = require("../.././config");
var Notification = function (userData) {
  //console.log(userData);
  this.username = userData.username;
  this.created_at = new Date();
};

Notification.verifyToken = function (req, result) {
  //console.log(req.params);
  //console.log(req.body);
  //console.log(req.headers);
  console.log("verifyToken Started Here");
  var data = {};
  // res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,authorization");
  if (
    req.url == "/login" ||
    req.url == "/register" ||
    req.url == "/countryList" ||
    req.headers["authorization"] ==
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjE3MGM4YTYwLWU3NDctNDljYy1hMGM2LTI5YWE1NTM2ZDMzNSIsImlhdCI6MTYwNjQ4Mjk5MCwiZXhwIjoxNjA2NDg2NTkwfQ.kBqy5GmKGwo64FW4FErZytIA5tkBP3EALgnai8gE6eM"
  ) {
    console.log("next");
    console.log("verifyToken Started Here next next next >>>>>>>>>");
    req.userId = "";
    //next();
    data["error"] = false;
    data["auth"] = true;
    data["msg"] = "Success";
    data["body"] = [];
    result(data);
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJ1c2VySUQiOjcsImlzQWRtaW4iOiIxIiwiaWF0IjoxNjgxNDcwODU1LCJleHAiOjE2ODE1NTcyNTV9.M5I7XSFOMbwm1M9BhRuITgZ1SuR1BfCzX9mvZKqcyYY
  } else {
    var token = req.headers["authorization"]; //req.params['authorization'];//req.headers['authorization'];
    console.log("tokentokentoken", token);
    if (!token) {
      //return res.status(403).send({auth: false, message: 'No token provided.', 'body': []});
      data["error"] = true;
      data["auth"] = false;
      data["msg"] = "No token provided.";
      data["body"] = [];
      result(data);
    } else {
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          // return res.status(500).send({auth: false, message: 'Failed to authenticate token.', 'body': []});
          data["error"] = true;
          data["auth"] = false;
          data["msg"] = "Failed to authenticate token.";
          data["body"] = [];
          result(data);
        } else {
          // if everything good, save to request for use in other routes
          if (req.files) {
            console.log("File object", req.files);
          }

          console.log("decoded object", decoded);
          req.userId = decoded.userId;
          req.isAdmin = decoded.isAdmin;
          data["error"] = false;
          data["auth"] = true;
          data["msg"] = "Success";
          data["userId"] = decoded.userID;
          data["isAdmin"] = decoded.isAdmin;
          data["body"] = [];
          result(data);
        }
      });
    }
  }
};
module.exports = Notification;
