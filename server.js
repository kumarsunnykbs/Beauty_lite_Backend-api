const express = require("express"),
  app = express(),
  bodyParser = require("body-parser");
port = process.env.PORT || 3025;
const expressip = require("express-ip");
let jwt = require("jsonwebtoken");
var fileupload = require("express-fileupload");
path = require("path");
var fs = require("fs-extra");
var morgan = require("morgan");
const http = require("http");
const https = require("https");
const helmet = require("helmet");
const cors = require("cors");
const fetch = require("node-fetch");
//app.use(helmet.xssFilter());
app.use(helmet());
//var fs = require('fs');
app.use(fileupload());
app.use(cors());

/*const whitelist = ['https://uzyth.com', 'https://app.uzyth.com', 'https://adminbo.uzyth.com','capacitor://localhost', 'http://localhost', 'https://www.uzyth.com', 'http://localhost:4200', 'https://devapp.uzyth.com', 'File://', 'file://']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("origin origin origin >>>>>", origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      // callback(new Error('Not allowed by CORS'))
      callback(JSON.stringify({ data: [], error: true}), true)
    }
  }
}

app.use(cors(corsOptions));*/

//app.listen(port);

//const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.uzyth.com/privkey.pem', 'utf8');///etc/ssl/api.uzyth.com/private.key', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/api.uzyth.com/fullchain.pem', 'utf8');///etc/ssl/api.uzyth.com/certificate.crt', 'utf8');

//const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');

const credentials = {
  //key: privateKey,
  //cert: certificate,
  //ca: ca
};
// Starting both http & https servers
const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

httpServer.listen(port, () => {
  console.log("HTTP Server running on port 80");
});

// httpsServer.listen(port, () => {
//   console.log('HTTPS Server running on port 443');
// });
console.log("API server started on: " + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(expressip().getIpInfoMiddleware);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

// setup the logger
app.use(morgan("tiny", { stream: accessLogStream }));

// app.all('/', function(req, res, next) {
//  		console.log("435435435435435435345345");
//  });
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization,Authorization");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization,authorization"
  );

  // console.log(req);

  next();
});
///app.use(require('./app/jwtMiddleware'));//JWT Authentication.Token expire after 24hr
//var assetlinks = fs.readFileSync(__dirname + '/utils/assetlinks.json');
app.get("/.well-known/assetlinks.json", function (req, res, next) {
  res.set("Content-Type", "application/json");
  console.log("req", req);
  res.status(200).send(assetlinks);
});
var routes = require("./app/routes/appRoutes"); //importing route
routes(app); //register the route

var request = require("request");
var cron = require("node-cron");

/*cron.schedule('59 * * * *', () => {
  request("https://api.uzyth.com/cronCall", function (error, response, body) {
      //  console.log(body);
      console.log('running a task every hours');
  });
});*/
// cron.schedule('* * * * *', () => {
//   console.log(new Date().getTime());
//         request.get({
//         'headers': {
//           'Origin': 'https://uzyth.com',
//         },
//         url: 'https://api.uzyth.com/checkPaymentStatus'
//     }, function (error, response, body) {
//        console.log(error);
//       console.log('running a task every minute');
//   });
// });

// cron.schedule('*/30 * * * *', () => {
//   console.log(new Date().getTime());
//   request("https://api.uzyth.com/uzythComnunicado", function (error, response, body) {
//        // console.log(body);
//       console.log('Running a task every 30 Minutes');
//   });
// });

// cron.schedule('*/30 * * * *', () => {
//   console.log(new Date().getTime());
//   request("https://api.uzyth.com/conversionPrices", function (error, response, body) {
//     // console.log(body);
//     console.log('Running a task every 30 Minutes');
//   });
// });

/*cron.schedule('1,15,30,45 * * * *', () => {
 request("https://api.uzyth.com/tradingFakeCron", function (error, response, body) {
      // console.log(body);
     console.log('tradingFakeCron running a task every 1,15,30,45 minute');
 });
});
cron.schedule('0 * * * *', () => {
 request("https://api.uzyth.com/dailyAdsFee", function (error, response, body) {
      // console.log(body);
     console.log('tradingFakeCron running a task every hours');
 });
}); */
// cron.schedule('*/5 * * * * *', () => {
//   console.log(new Date().getTime());
//         request.get({
//         'headers': {
//           'Origin': 'https://uzyth.com',
//         },
//         url: 'https://api.uzyth.com/tradingCron'
//     }, function (error, response, body) {
//        // console.log(body);
//         console.log(error);
//       console.log('running a tradingCron every 5 sec');
//   });
// });

// cron.schedule('*/2 * * * *', async () => {
//   const https = require("https");
//   const agent = new https.Agent({
//     rejectUnauthorized: false,
//   });
//   const response = await fetch("https://api.uzyth.com/auto-buy-nft",{
//     method: 'GET',
//     agent
//   });
// });

// cron.schedule('* * * * *', () => {
//  request("https://api.uzyth.com/uzyth-urgent-email", function (error, response, body) {
//       // console.log(body);
//      console.log('uzyth-urgent-email running a task every minute');
//  });
// });
