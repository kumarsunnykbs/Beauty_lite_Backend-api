"user strict";
var sql = require("./db.js");
var dbFunc = require("./db-functions.js");
const bcrypt = require("bcrypt");
let config = require("../../config");
var request = require("request");
var speakeasy = require("speakeasy");
let jwt = require("jsonwebtoken");

var WAValidator = require("wallet-address-validator");
const saltRounds = 10;
var langJson = require("./lang.json");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("uzythSecure22v");
bcypher = require("blockcypher");
var ashok_url = "";
var uuid = require("uuid");
// var ashok_url = 'http://127.0.0.1:9005';

var Exchanges = require("../model/exchangeModel.js");
var { getDistanceFromLatLng } = require("../../utils/validation");
// const salvadorCities = require("../../utils/cities.json");

var mergeArray = require("merge-array");

const zythMinWithd = 10;
const zythMaxWithd = 200000;

const BNBMinWithd = 0;
const BNBMaxWithd = 200000;

const accountSid = "";
const authToken = "";
const client = require("twilio")(accountSid, authToken);

//Task object constructor
var User = function (userData) {
  console.log(userData);
  this.username = userData.username;
  this.created_at = new Date();
};

User.getDashboardStats = function (result) {
  var data = {};
  var yourDateTime = new Date();
  const dateTimeInParts = yourDateTime.toISOString().split("T");
  const date = dateTimeInParts[0]; // "2021-08-31"
  console.log(">>>>>>>>>>>>>>>", date);
  sql.query(
    `select count(id) as total_nft_count,(select count(id) from nft_history where date(created_at) = '${date}') as today_nft_sold,(SELECT count(id) from nft_history) as total_nft_sold,(SELECT sum(amount) from nft_data) AS total_nft_value,(select sum(amount) from nft_history) as sold_nft_value from nft_data where nft_data.is_deleted ='0'`,

    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        // dbFunc.connectionRelease;
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "dashboard stats fetched successfully";
        data["body"] = res;
        dbFunc.connectionRelease;
        result(null, data);
      }
    }
  );
};

User.getallnft = (params, result) => {
  var data = {};
  var searchStr = params.searchStr;
  var typeData = [];
  params.type.split(",").forEach((i) => {
    typeData.push(i);
  });
  sql.query('select * from nft_data where is_deleted = "0"', (err, resp) => {
    if (err) {
      data["error"] = true;
      data["msg"] = err;
      data["body"] = [];
      result(null, data);
    } else {
      if (resp.length > 0) {
        if (!searchStr && !typeData) {
          data["error"] = false;
          data["msg"] = "fetched successfully";
          data["body"] = resp;
          result(null, data);
        } else if (searchStr && typeData.length > 1) {
          var filtered = [];
          resp.filter((item) => {
            typeData.forEach((element) => {
              if (item.type.includes(element)) {
                filtered.push(item);
              } else if (
                item.title.toLowerCase().indexOf(searchStr.toLowerCase()) >
                  -1 ||
                item.item_type.indexOf(searchStr.toLowerCase()) > -1
              ) {
                filtered.push(item);
              }
            });
          });
          data["error"] = false;
          data["msg"] = filtered.length
            ? "fetched successfully"
            : "No Data Found";
          data["body"] = filtered;
          result(null, data);
        } else if (searchStr && typeData.length == 1) {
          var filtered1 = [];
          resp.filter((item) => {
            if (item.item_type) {
              if (
                item.item_type.toLowerCase().indexOf(searchStr.toLowerCase()) >
                  -1 ||
                item.title.toLowerCase().indexOf(searchStr.toLowerCase()) > -1
              ) {
                filtered1.push(item);
              }
            }
          });
          data["error"] = false;
          data["msg"] = filtered1.length
            ? "fetched successfully"
            : "No Data Found";
          data["body"] = filtered1;
          result(null, data);
        } else if (typeData && !searchStr) {
          if (typeData) {
            var filtered2 = [];
            resp.filter((item) => {
              typeData.forEach((element) => {
                if (item.type.includes(element)) {
                  filtered2.push(item);
                }
              });
            });
            data["error"] = false;
            data["msg"] = filtered2.length
              ? "fetched successfully"
              : "No Data Found";
            data["body"] = filtered2;
            result(null, data);
          } else {
            data["error"] = false;
            data["msg"] = resp.length
              ? "fetched successfully"
              : "No Data Found";
            data["body"] = resp;
            result(null, data);
          }
        } else {
          data["error"] = false;
          data["msg"] = "fetched successfully";
          data["body"] = resp;
          result(null, data);
        }
      } else {
        data["error"] = false;
        data["msg"] = "No data found";
        data["body"] = [];
        result(null, data);
      }
    }
  });
};

User.addWalletHistory = (walletData, result) => {
  var data = {};
  sql.query(
    "select * from user_wallets where wallet_address = ?",
    [walletData.wallet_address],
    (error, resp) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        dbFunc.connectionRelease;
        result(null, data);
      } else {
        var updateData = {
          wallet_address: walletData.wallet_address,
          balance: walletData.balance,
          activity: walletData.activity,
        };
        if (resp.length) {
          if (resp[0].wallet_address == walletData.wallet_address) {
            sql.query(
              "update user_wallets set ? where wallet_address = ?",
              [updateData, walletData.wallet_address],
              (err, resp1) => {
                if (err) {
                  data["error"] = true;
                  data["msg"] = error;
                  data["body"] = [];
                  dbFunc.connectionRelease;
                  result(null, data);
                } else {
                  data["error"] = false;
                  data["msg"] = "Updated Successfully";
                  data["body"] = resp1;
                  dbFunc.connectionRelease;
                  result(null, data);
                }
              }
            );
          }
        } else {
          var insertData = {
            wallet_address: walletData.wallet_address,
            balance: walletData.balance,
            activity: walletData.activity,
          };
          sql.query(
            "insert into user_wallets set ?",
            [insertData],
            (err, resp2) => {
              if (err) {
                data["error"] = true;
                data["msg"] = error;
                data["body"] = [];
                dbFunc.connectionRelease;
                result(null, data);
              } else {
                data["error"] = false;
                data["msg"] = "Inserted Successfully";
                data["body"] = resp2;
                dbFunc.connectionRelease;
                result(null, data);
              }
            }
          );
        }
      }
    }
  );
};
module.exports = User;
