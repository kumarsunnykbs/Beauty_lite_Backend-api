/*'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'uzyth.cyqw8btngqoz.us-east-2.rds.amazonaws.com',
    user     : 'adminuzyth',
    password : 'jG9OzAyB2oR5dUt3ojnz',
    database : 'db_uzyth'
});

connection.connect(function(err) {
	 console.log("err",err);
    if (err) throw err;
    console.log("connected with mysql!!");
});

module.exports = connection;*/

const mysql = require("mysql");
/* 
$dbhost = 'localhost';
 $dbuser = 'root';
 $dbpass = '09UzL423Ffs3fo4SecreLogQn1ndbshawrvsjaqwe761';
 $dbname = 'db_uzyth'; 
*/

module.exports = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "",
  database: "beauty_lite_db",
});

/* createConnection module.exports = mysql.createPool({
    host     : 'uzlatest.cyqw8btngqoz.us-east-2.rds.amazonaws.com',
    user     : 'adminuzyth',
    password : '0508SecuRtgbTns67sq18hd5hs2sh1gg',
    database : 'db_uzyth'
}) */
