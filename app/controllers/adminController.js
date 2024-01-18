"use strict";

var User = require("../model/userModel.js");
var Auth = require("../model/authModel.js");
var jwtMiddleware = require("./jwtMiddleware.js");
var Admin = require("../model/adminModel.js");
const ROOT_PATH = require("../../rootPath.js");
const AWS = require("aws-sdk");
const { aWSCredentials } = require("../../utils/users");
const USER_KEY = aWSCredentials.Access_Key; //'AKIATUGJAROHMYRTMSFC';
const USER_SECRET = "";
// const USER_SECRET = aWSCredentials.Secret_Key//'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';
const BUCKET_NAME = aWSCredentials.Bucket; //'uzyth';
const reader = require("xlsx");
const fs = require("fs");
var { v4: uuid } = require("uuid");
// const ROOT_PATH = require("../../rootPath.js");

let s3bucket = new AWS.S3({
  accessKeyId: USER_KEY,
  secretAccessKey: USER_SECRET,
  Bucket: BUCKET_NAME,
});

exports.addNft = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.files) {
          let getFile = req.files.file; //mimetype
          var ext = path.extname(getFile.name);
          let imageTitle = param.title;
          var filename = Date.now() + "_" + imageTitle + ext;
          var fileData = getFile["data"];
          var r = 0;
          var imageName = `${imageTitle}_${new Date().getTime()}`;
          s3bucket.createBucket(function () {
            var params = {
              Bucket: BUCKET_NAME + "/nftimage/" + imageName,
              Key: filename,
              ACL: "public-read",
              Body: fileData,
            };
            s3bucket.upload(params, function (err, data) {
              if (err) {
              }
              param.filepath = data.Location;
              Admin.addNft(param, function (err, response) {
                if (err) res.send(err);
                res.json(response);
              });
            });
          });
        } else {
          Admin.addNft(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
          });
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.getAllNfts = function (req, res) {
  var data = {};
  var param = req.query;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getAllNfts(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.updateNFTDetails = function (req, res) {
  var data = {};
  var param = req.body;
  //handles null error
  console.log("params......", param);
  jwtMiddleware.verifyToken(req, function (response) {
    console.log("r4esponse", response);
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.param && !!param.nft_id) {
          Admin.updateNFTDetails(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
          });
        } else {
          data["error"] = true;
          data["msg"] = "NFT ID field required";
          data["body"] = [];
          res.json(data);
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.deleteNftById = function (req, res) {
  var data = {};
  var param = req.params.id;
  console.log("dssseyyeyyyuyu", param);
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.deleteNftById(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addProjectDesc = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.addProjectDesc(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.getProjectDesc = function (req, res) {
  var data = {};
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getProjectDesc(function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addVideos = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.files) {
          let getFile = req.files.file; //mimetype
          console.log(getFile);
          // return
          const fileNamee = getFile.name;
          const new_name = fileNamee.replaceAll(" ", "_");

          var ext = path.extname(new_name);
          let imageTitle = new_name;
          var filename = Date.now() + "_" + imageTitle;
          var fileData = getFile["data"];
          var r = 0;
          var fileName = `${imageTitle}_${new Date().getTime()}`;
          s3bucket.createBucket(function () {
            var params = {
              Bucket: BUCKET_NAME + "/video_file/" + fileName,
              Key: filename,
              ACL: "public-read",
              Body: fileData,
            };
            console.log("params>>>>>", params);
            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log(err);
              }
              param.filepath = data.Location;
              Admin.addVideos(param, function (err, response) {
                if (err) res.send(err);
                res.json(response);
              });
            });
          });
        } else {
          data["error"] = true;
          data["msg"] = "Please select video firstly";
          data["body"] = [];
          res.json(data);
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

// exports.addVideos = function (req, res) {
//   var data = {};
//   var param = req.body;
//   jwtMiddleware.verifyToken(req, function (response) {
//     if (response.error == false) {
//       if (response.isAdmin != "0") {
//         Admin.addVideos(param, function (err, response) {
//           if (err) response.send(err);
//           res.json(response);
//         });
//       } else {
//         data["error"] = true;
//         data["msg"] = "You are not authorized for this request";
//         data["body"] = [];
//         res.json(data);
//       }
//     } else {
//       res.json(response);
//     }
//   });
// };

exports.getVideos = function (req, res) {
  var data = {};
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getVideos(function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addVedioSets = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.addVedioSets(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addComics = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.files) {
          let getFile = req.files.file; //mimetype
          const fileNamee = getFile.name;
          const new_name = fileNamee.replaceAll(" ", "_");
          var ext = path.extname(new_name);

          let imageTitle = new_name;
          var filename = Date.now() + "_" + imageTitle;
          var fileData = getFile["data"];
          var r = 0;
          var fileName = `${imageTitle}_${new Date().getTime()}`;
          s3bucket.createBucket(function () {
            var params = {
              Bucket: BUCKET_NAME + "/comics_image/" + fileName,
              Key: filename,
              ACL: "public-read",
              Body: fileData,
            };
            console.log("params>>>>>", params);
            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log(err);
              }
              // console.log(data);
              // return
              param.filepath = data.Location;
              Admin.addComics(param, function (err, response) {
                if (err) res.send(err);
                res.json(response);
              });
            });
          });
        } else {
          data["error"] = true;
          data["msg"] = "Please select video firstly";
          data["body"] = [];
          res.json(data);
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.editComics = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.files) {
          let getFile = req.files.file; //mimetype
          const fileNamee = getFile.name;
          const new_name = fileNamee.replaceAll(" ", "_");
          var ext = path.extname(new_name);

          let imageTitle = new_name;
          var filename = Date.now() + "_" + imageTitle;
          var fileData = getFile["data"];
          var r = 0;
          var fileName = `${imageTitle}_${new Date().getTime()}`;
          s3bucket.createBucket(function () {
            var params = {
              Bucket: BUCKET_NAME + "/comics_image/" + fileName,
              Key: filename,
              ACL: "public-read",
              Body: fileData,
            };
            console.log("params>>>>>", params);
            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log(err);
              }
              // console.log(data);
              // return
              param.filepath = data.Location;
              Admin.editComics(param, function (err, response) {
                if (err) res.send(err);
                res.json(response);
              });
            });
          });
        } else {
          Admin.editComics(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
          });
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.nftBulkImporttt = function (req, res) {
  var data = {};
  var param = req.body;
  console.log("=============>", req.files);
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.files) {
          let getFile = req.files.file; //mimetype
          const fileNamee = getFile.name;
          const new_name = fileNamee.replaceAll(" ", "_");
          var ext = path.extname(new_name);

          let imageTitle = new_name;
          console.log("getFile____", getFile, fileNamee, new_name, ext);

          var filename = Date.now() + "_" + imageTitle;
          var fileData = getFile["data"];
          var r = 0;
          var fileName = `${imageTitle}_${new Date().getTime()}`;
          s3bucket.createBucket(function () {
            var params = {
              Bucket: BUCKET_NAME + "/csv_data/" + fileName,
              Key: filename,
              ACL: "public-read",
              Body: fileData,
            };
            console.log("params>>>>>", params);
            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log(err);
              }
              // console.log(data);
              // return
              param.filepath = data.Location;
              Admin.nftBulkImport(param, function (err, response) {
                if (err) res.send(err);
                res.json(response);
              });
            });
          });
        } else {
          Admin.nftBulkImport(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
          });
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.nftBulkImport = async (req, result) => {
  var params = req.body;
  console.log("data)()()()(", params);
  console.log("*********", req.files.file.name);
  // return
  params.file = "";
  let excelFile = req.files.file;
  console.log("()))()())()(", excelFile);
  let imageUrl = ROOT_PATH;
  imageUrl = `${imageUrl}/document/${Date.now()}.${
    req.files.file.name.split(".")[1]
  }`;
  console.log("imageUrl", imageUrl);
  console.log("imageUrl ROOT_PATH", ROOT_PATH);

  // return
  excelFile.mv(imageUrl, async (err) => {
    if (err) {
      console.log("errrrrrr", err);
      return result.status(500).send(err);
    } else {
      params.docFile = imageUrl;
      console.log("imageURL", imageUrl);
      //
      function readExcel() {
        return new Promise((resolve, fail) => {
          // try {
          const file = reader.readFile(imageUrl);
          // console.log("====>",file)
          let data = [];
          const sheets = file.SheetNames;
          console.log("====>", sheets);

          for (let i = 0; i < sheets.length; i++) {
            const temp = reader.utils.sheet_to_json(
              file.Sheets[file.SheetNames[i]]
            );
            // console.log("+++++++++temp",temp)

            temp.forEach((res) => {
              let newData = { ...res, id: uuid() };
              // //insert query here
              // console.log("resp", newData)
              // return
              data.push(res);
            });
          }
          // return
          resolve(data);
          // } catch (err) {
          //     fail("fail")
          // }
        });
      }
      const data = await readExcel();
      // console.log("datadatadatadatadatadata",data);
      // return
      const newData = data.map((ele) => {
        return {
          title: ele.title,
          item_type: ele.item_type,
          category: ele.category,
          amount: ele.amount,
          nft_image: ele.image_url,
          nft_attributes_meta: ele.nft_attributes_meta,
          additional_attributes: ele.additional_attributes,
          json_meta_file: ele.json_meta_file,
          description: ele.description,
          additional_info: ele.additional_info,
        };
      });

      console.log("new Data", data);
      // console.log("____________newsata", newData);
      // return
      fs.unlinkSync(imageUrl);
      params.newData = newData;
      Admin.nftBulkImport(params, (error, response) => {
        if (error) {
          console.log("error", error);
          result.send(error);
        }
        result.json(response);
      });
    }
  });
};

// Imports.addSpendDownTable = async function (req, res) {
//   console.log(req.file)
//   console.log('------------inside user-----------', req.body.entered_by)
//   try {
//       if (req.file == undefined) {
//           return res.status(200).send("Please upload a CSV file!");
//       }
//       // sided report data array
//       let reportData = [];
//       let filePath = __basedir + "/imports/" + req.file.filename;
//       console.log(req.file)

//       fs.createReadStream(filePath)
//           .pipe(csv.parse({ headers: true }))
//           .on("error", (error) => {
//               throw error.message;
//           })
//           .on("data", async (row) => {
//               // console.log('---------------row', row)
//               //row.id = uuid()
//               reportData.push(row)
//           })
//           .on("end", async () => {
//               var response = {}
//               reportData.forEach((report, index) => {
//                   const name = report.Community
//                   sql.query('select id as community_id from community_portal where community_name=?', [name], (error, agCommunity) => {
//                       if (error) {
//                           response.error = true
//                           response.msg = error.code
//                           response.body = [error]
//                           if (reportData.length - 1 == index) {
//                               res.status(200).send(response);
//                           }
//                       } else {
//                           if (agCommunity.length != 0) {
//                               report.community_id = agCommunity[0].community_id
//                               report.receipt_id = uuid()
//                               report.entered_by = req.body.entered_by
//                               report.purchage_date = moment(report.Purchage_date).format("YYYY-MM-DD")
//                               report.start_date = moment(report.Start_date).format("YYYY-MM-DD")
//                               delete report.Community
//                               delete report.Row
//                               delete report.Purchage_date
//                               delete report.Start_date

//                               sql.query('Insert into spend_down_table Set ?', [report], (error, result) => {
//                                   if (error) {
//                                       console.log('-----response-----', response)
//                                       response.error = true
//                                       response.msg = error.code
//                                       response.body = [error]
//                                       if (reportData.length - 1 == index) {
//                                           res.status(200).send(response);
//                                       }
//                                   } else {
//                                       response.error = false
//                                       response.msg = 'Record Added'
//                                       response.body = result
//                                       if (reportData.length - 1 == index) {
//                                           res.status(200).send(response);
//                                       }
//                                   }
//                               })

//                           } else {
//                               response.error = true
//                               response.msg = 'Community does not exist'
//                               if (reportData.length - 1 == index) {
//                                   res.status(200).send(response);
//                               }
//                           }
//                       }
//                   })
//               })
//           });
//   } catch (error) {
//       console.error("error", error);
//   }
// }

exports.addWallet = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.addWallet(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addRoyality = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.addRoyality(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.getWallet = function (req, res) {
  var data = {};
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getWallet(function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

// exports.getRoyality = function (req, res) {
//   var data = {};
//   jwtMiddleware.verifyToken(req, function (response) {
//     if (response.error == false) {
//       if (response.isAdmin != "0") {
//         Admin.getRoyality(function (err, response) {
//           if (err) response.send(err);
//           res.json(response);
//         });
//       } else {
//         data["error"] = true;
//         data["msg"] = "You are not authorized for this request";
//         data["body"] = [];
//         res.json(data);
//       }
//     } else {
//       res.json(response);
//     }
//   });
// };

exports.addRoadmap = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.addRoadmap(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.editRoadmap = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.editRoadmap(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.deleteRoadmap = function (req, res) {
  var data = {};
  var param = req.params;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.deleteRoadmap(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.getAllRoadmap = function (req, res) {
  var data = {};
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getAllRoadmap(function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addFAQ = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.addFAQ(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.editFAQ = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.editFAQ(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.deleteFAQ = function (req, res) {
  var data = {};
  var param = req.params;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.deleteFAQ(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.getAllFAQ = function (req, res) {
  var data = {};
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getAllFAQ(function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addTeam = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.files) {
          let getFile = req.files.file; //mimetype
          const fileNamee = getFile.name;
          const new_name = fileNamee.replaceAll(" ", "_");
          var ext = path.extname(new_name);

          let imageTitle = new_name;
          var filename = Date.now() + "_" + imageTitle;
          var fileData = getFile["data"];
          var r = 0;
          var fileName = `${imageTitle}_${new Date().getTime()}`;
          s3bucket.createBucket(function () {
            var params = {
              Bucket: BUCKET_NAME + "/teams_image/" + fileName,
              Key: filename,
              ACL: "public-read",
              Body: fileData,
            };
            console.log("params>>>>>", params);
            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log(err);
              }
              param.filepath = data.Location;
              Admin.addTeam(param, function (err, response) {
                if (err) res.send(err);
                res.json(response);
              });
            });
          });
        } else {
          data["error"] = true;
          data["msg"] = "Please select video firstly";
          data["body"] = [];
          res.json(data);
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.editTeam = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.files) {
          let getFile = req.files.file; //mimetype
          const fileNamee = getFile.name;
          const new_name = fileNamee.replaceAll(" ", "_");
          var ext = path.extname(new_name);

          let imageTitle = new_name;
          var filename = Date.now() + "_" + imageTitle;
          var fileData = getFile["data"];
          var r = 0;
          var fileName = `${imageTitle}_${new Date().getTime()}`;
          s3bucket.createBucket(function () {
            var params = {
              Bucket: BUCKET_NAME + "/teams_image/" + fileName,
              Key: filename,
              ACL: "public-read",
              Body: fileData,
            };
            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log(err);
              }
              param.filepath = data.Location;
              Admin.editTeam(param, function (err, response) {
                if (err) res.send(err);
                res.json(response);
              });
            });
          });
        } else {
          Admin.editTeam(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
          });
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.deleteTeam = function (req, res) {
  var data = {};
  var param = req.params;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.deleteTeam(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.getAllTeam = function (req, res) {
  var data = {};
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getAllTeam(function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addComicDesc = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.addComicDesc(param, function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.getAllComicDesc = function (req, res) {
  var data = {};
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getAllComicDesc(function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.addDocumentryVideo = function (req, res) {
  var data = {};
  var param = req.body;
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        if (req.files) {
          let getFile = req.files.file; //mimetype
          console.log(getFile);
          // return
          const fileNamee = getFile.name;
          const new_name = fileNamee.replaceAll(" ", "_");

          var ext = path.extname(new_name);
          let imageTitle = new_name;
          var filename = Date.now() + "_" + imageTitle;
          var fileData = getFile["data"];
          var r = 0;
          var fileName = `${imageTitle}_${new Date().getTime()}`;
          s3bucket.createBucket(function () {
            var params = {
              Bucket: BUCKET_NAME + "/video_file/" + fileName,
              Key: filename,
              ACL: "public-read",
              Body: fileData,
            };
            console.log("params>>>>>", params);
            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log(err);
              }
              param.filepath = data.Location;
              Admin.addDocumentryVideo(param, function (err, response) {
                if (err) res.send(err);
                res.json(response);
              });
            });
          });
        } else {
          data["error"] = true;
          data["msg"] = "Please select video firstly";
          data["body"] = [];
          res.json(data);
        }
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};

exports.getDocumentryVideo = function (req, res) {
  var data = {};
  jwtMiddleware.verifyToken(req, function (response) {
    if (response.error == false) {
      if (response.isAdmin != "0") {
        Admin.getDocumentryVideo(function (err, response) {
          if (err) response.send(err);
          res.json(response);
        });
      } else {
        data["error"] = true;
        data["msg"] = "You are not authorized for this request";
        data["body"] = [];
        res.json(data);
      }
    } else {
      res.json(response);
    }
  });
};
