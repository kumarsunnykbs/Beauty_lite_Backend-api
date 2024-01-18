"user strict";
var sql = require("./db.js");
var dbFunc = require("./db-functions.js");
let config = require("../../config");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const excel = require("node-excel-export");
var mergeArray = require("merge-array");
const { orderBy } = require("natural-orderby");
var uuid = require("uuid");
var request = require("request");
var { v4: uuid } = require("uuid");

const fs = require("fs");
// const AWS = require("aws-sdk");

const AWS = require("aws-sdk");
const { aWSCredentials } = require("../../utils/users.js");
const USER_KEY = aWSCredentials.Access_Key; 
const USER_SECRET = "";

const BUCKET_NAME = aWSCredentials.Bucket; //'uzyth';
const reader = require("xlsx");
var { v4: uuid } = require("uuid");
// const ROOT_PATH = require("../../rootPath.js");

let s3bucket = new AWS.S3({
  accessKeyId: USER_KEY,
  secretAccessKey: USER_SECRET,
  Bucket: BUCKET_NAME,
});


bcypher = require("blockcypher");
var bcapi = new bcypher("btc", "main", "1a9daeb78d924879a1d5a84391b6daef");
const Cryptr = require("cryptr");
const { count } = require("console");
const { exit } = require("process");
const cryptr = new Cryptr("uzythSecure22v");


//Task object constructor
var Admin = function (userData) {
  console.log(userData);
  this.username = userData.username;
  this.created_at = new Date();
};

Admin.addNft = function (nftData, result) {
  var data = {};

  var type = nftData.type;
  var jsonArray = JSON.parse(type);
  var displayValues = [];
  for (var i = 0; i < jsonArray.length; i++) {
    var displayValue = jsonArray[i].display;
    displayValues.push(displayValue);
    console.log(displayValue);
  }
  console.log(
    "typetypetypetypetype",
    type,
    "data1data1data1",
    jsonArray.length,
    "  console.log(displayValue);",
    displayValues
  );
  // return false;

  var insertedData = {
    title: nftData.title ? nftData.title : null,
    nft_id: uuid(),
    amount: nftData.amount ? nftData.amount : null,
    nft_image: nftData.filepath ? nftData.filepath : null,
    nft_attributes_meta: nftData.nft_attributes_meta
      ? nftData.nft_attributes_meta
      : null,
    additional_attributes: nftData.additional_attributes
      ? nftData.additional_attributes
      : null,
    description: nftData.description ? nftData.description : null,
    is_discover_nft: nftData.is_discover_nft ? nftData.is_discover_nft : null,
    is_minting: nftData.is_minting ? nftData.is_minting : null,
    json_meta_file: nftData.json_meta_file ? nftData.json_meta_file : null,
    additional_info: nftData.additional_info ? nftData.additional_info : null,
    _type: nftData.type ? nftData.type : null,
    type: JSON.stringify(displayValues),
  };
  console.log(
    "insertedDatainsertedDatainsertedDatainsertedDatainsertedData",
    insertedData
  );


  sql.query(
    "INSERT INTO `nft_data` SET ?",
    [insertedData],
    function (err, res) {
      if (err) {
        console.log(err);
        data["error"] = true;
        data["msg"] = err.code;
        data["body"] = [err];
        dbFunc.connectionRelease;
        result(null, data);
      } else {
        console.log(res);
        data["error"] = false;
        data["msg"] = "Success";
        data["body"] = res;
        dbFunc.connectionRelease;
        result(null, data);
      }
    }
  );
  // } else {
  //   data["error"] = true;
  //   data["msg"] = "Something went wrong.";
  //   data["body"] = [];
  //   dbFunc.connectionRelease;
  //   result(null, data);
  // }
  // }
  // );
};

Admin.getAllNfts = (params, result) => {
  var data = {};
  var searchStr = params.searchStr;
  sql.query(
    "Select * from nft_data where is_deleted = '0'",
    function (err, res) {
      if (err) {
        data["error"] = true;
        data["msg"] = err.code;
        data["body"] = [];
        result(null, data);
      } else {
        console.log(res);
        if (searchStr) {
          var filtered = res.filter((item) => {
            if (item.item_type.toLowerCase() == searchStr.toLowerCase()) {
              return item.item_type;
            }
          });
          console.log(filtered);

          data["error"] = false;
          data["msg"] = "fetched successfully";
          data["body"] = filtered;
          result(null, data);
        } else {
          data["error"] = false;
          data["msg"] = "fetched successfully";
          data["body"] = res;
          result(null, data);
        }
      }
    }
  );
};

Admin.updateNFTDetails = function (nftData, result) {
  var data = {};
  console.log(nftData);
  var updatedData = {
    item_type: nftData.item_type ? nftData.item_type : null,
    title: nftData.title ? nftData.title : null,
    nft_id: nftData.nft_id ? nftData.nft_id : null,
    card_id: nftData.card_id ? nftData.card_id : null,
    amount: nftData.amount ? nftData.amount : null,
    nft_ipfs_uri: nftData.nft_ipfs_uri ? nftData.nft_ipfs_uri : null,
    nft_attributes_meta: nftData.nft_attributes_meta
      ? JSON.stringify(nftData.nft_attributes_meta)
      : null,
  };
  sql.query(
    "UPDATE `nft_data` SET ? where id=?",
    [updatedData, nftData.id],
    function (err, res) {
      if (err) {
        console.log(err);
        data["error"] = true;
        data["msg"] = err.code;
        data["body"] = [err];
        dbFunc.connectionRelease;
        result(null, data);
      } else {
        console.log(res);
        data["error"] = false;
        data["msg"] = "Success";
        data["body"] = res;
        dbFunc.connectionRelease;
        result(null, data);
      }
    }
  );
};

Admin.deleteNftById = (id, result) => {
  var data = {};
  sql.query(
    "update nft_data set is_deleted = '1' WHERE id= ?",
    [id],
    (error, resp) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error.code;
        data["body"] = [];
        dbFunc.connectionRelease;
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "NFT Deleted successfully";
        data["body"] = [];
        dbFunc.connectionRelease;
        result(null, data);
      }
    }
  );
};

Admin.addProjectDesc = (params, result) => {
  var data = {};
  sql.query("select * from project_details", (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      if (res.length > 0) {
        sql.query(
          "update project_details set project_description = ?",
          [params.project_desc],
          (error, resp) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error.code;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "updated successfully";
              data["body"] = resp;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      } else {
        let insertData = {
          project_description: params.project_desc,
        };
        sql.query(
          "insert into project_details set ?",
          [insertData],
          (error, resp1) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error.code;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "Added Successfully";
              data["body"] = resp1;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      }
    }
  });
};

Admin.getProjectDesc = (result) => {
  var data = {};
  sql.query("select * from project_details", (error, resp) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error.code;
      data["body"] = [];
      dbFunc.connectionRelease;
      result(null, data);
    } else {
      data["error"] = false;
      data["msg"] = "Fetched successfully";
      data["body"] = resp;
      dbFunc.connectionRelease;
      result(null, data);
    }
  });
};

Admin.addVideos = (params, result) => {
  var data = {};
  console.log("paramsparamsparamsparams>>>>>>>>", params);
  // return;
  sql.query("select * from banner_video", (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      if (res.length > 0) {
        let updatedData = {
          title: params.title,
          description: params.description,
          video_url: params.filepath,
        };
        sql.query(
          "update banner_video set ? where id= ?",
          [updatedData, res[0].id],
          (error, resp) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "updated successfully";
              data["body"] = resp;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      } else {
        let insertData = {
          title: params.title,
          description: params.description,
          video_url: params.filepath,
        };
        sql.query(
          "insert into banner_video set ?",
          [insertData],
          (error, resp1) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "Added Successfully";
              data["body"] = resp1;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      }
    }
  });
};

Admin.getVideos = (result) => {
  var data = {};
  sql.query("select * from banner_video", (error, resp1) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      dbFunc.connectionRelease;
      result(null, data);
    } else {
      data["error"] = false;
      data["msg"] = "Fetched Successfully";
      data["body"] = resp1;
      dbFunc.connectionRelease;
      result(null, data);
    }
  });
};

Admin.addVedioSets = (params, result) => {
  var data = {};

  let insertData = {
    title: params.title,
    description: params.description,
    video_url: params.video_url,
  };
  sql.query("insert into video_sets set ?", [insertData], (error, resp1) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      dbFunc.connectionRelease;
      result(null, data);
    } else {
      data["error"] = false;
      data["msg"] = "Added Successfully";
      data["body"] = resp1;
      dbFunc.connectionRelease;
      result(null, data);
    }
  });
};

Admin.addComics = (params, result) => {
  var data = {};

  let insertData = {
    title: params.title,
    comics_path: params.filepath,
  };
  sql.query("insert into uc_comics set ?", [insertData], (error, resp1) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      dbFunc.connectionRelease;
      result(null, data);
    } else {
      data["error"] = false;
      data["msg"] = "Added Successfully";
      data["body"] = resp1;
      dbFunc.connectionRelease;
      result(null, data);
    }
  });
};

Admin.editComics = (params, result) => {
  var data = {};
  sql.query(
    "select * from uc_comics where id = ?",
    [params.id],
    (err, resp) => {
      if (err) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        dbFunc.connectionRelease;
        result(null, data);
      } else {
        if (resp.length > 0) {
          let upData = {
            title: params.title,
          };
          if (params.filepath) {
            upData.comics_path = params.filepath;
          }
          sql.query(
            "update uc_comics set ? where id = ?",
            [upData, params.id],
            (error, resp1) => {
              if (error) {
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
        } else {
          data["error"] = false;
          data["msg"] = "Data not available to update";
          data["body"] = [];
          dbFunc.connectionRelease;
          result(null, data);
        }
      }
    }
  );
};

async function sheetData(
  currentValue,
  currentIndex,
  totalLength,
  allValues,
  callback
) {
  var data = {};
  console.log("=================>>>>>>>>>>");
  console.log(
    "((((((((((((currentValuecurrentValue((((()()()))(",
    currentValue
  );
  if (currentIndex == totalLength) {
    callback(true);
  } else {
    let index = currentIndex + 1;
    console.log("indexindexindexindex,index", index);
    try {
      request(
        { url: currentValue.nft_image, encoding: null },
        (error, response1, body) => {
          if (!error && response1) {
            const params = {
              Bucket: BUCKET_NAME + "/nft_data/" + currentValue.nft_image,
              Key: currentValue.nft_image,
              ACL: "public-read",
              Body: body,
              ContentType: response1.headers["content-type"],
            };
            s3bucket.upload(params, (error, data) => {
              if (error) {
                console.error(error);
              } else {
                console.log(`Image uploaded successfully to ${data.Location}`);
                const nftIPFSData = {
                  name: currentValue.title,
                  description: currentValue.description,
                  image: data.Location,
                  attributes: JSON.parse(currentValue.json_meta_file),
                };
                request(
                  {
                    url: "http://44.214.51.175:9005/save/ipfsData",
                    method: "POST",
                    headers: {
                      "content-type": "application/json",
                      // "API-KEY": "2P04TK6bzZffQznoJw3CIUHjykV",
                      // "API-KEY-SECRET": "d076d937eb14c0effa7ad37ede9a164b"
                    },
                    body: nftIPFSData,
                    json: true,
                  },
                  async function (error, response, body) {
                    if (response.body.nft_image || response.body.nft_uri) {
                      const insertData = {
                        title: currentValue.title,
                        item_type: currentValue.item_type,
                        category: currentValue.category,
                        amount: currentValue.amount,
                        nft_image: data.Location,
                        nft_ipfs_image: response.body.nft_image,
                        nft_ipfs_uri: response.body.nft_uri,
                        nft_attributes_meta: currentValue.nft_attributes_meta,
                        additional_attributes:
                          currentValue.additional_attributes,
                        json_meta_file: currentValue.json_meta_file,
                        description: currentValue.description,
                        additional_info: currentValue.additional_info,
                      };
                      sql.query(
                        "Insert into nft_data SET ?",
                        [insertData],
                        function (error, response) {
                          if (error) {
                            sheetData(
                              allValues[index],
                              index,
                              totalLength,
                              allValues,
                              callback
                            );
                          } else {
                            sheetData(
                              allValues[index],
                              index,
                              totalLength,
                              allValues,
                              callback
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          } else {
            console.error(
              error ||
                `Failed to download image, status code: ${response1.statusCode}`
            );
          }
        }
      );
    } catch (error) {
      console.log("___________>error", error);
      sheetData(allValues[index], index, totalLength, allValues, callback);
    }
  }
}

Admin.nftBulkImport = async function (userData, result) {
  var data = {};
  let userdata = userData.newData;
  // console.log("()())()()()(______userdatauserdatauserdatauserdata ", userdata)
  // return

  sheetData(userdata[0], 0, userdata.length, userdata, (res) => {
    console.log("resssssssssssssss", res);
    data["error"] = false;
    data["msg"] = "data inserted successfully";
    data["body"] = res;
    result(null, data);
  });
};


Admin.addWallet = (params, result) => {
  var data = {};
  sql.query("select * from admin_settings where id = ?", [1], (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      if (res.length > 0) {
        const upData = {
          ethereum_address: params.ethereum_address,
          bitcoin_address: params.bitcoin_address,
        };
        sql.query(
          "update admin_settings set ? where id = ?",
          [upData, 1],
          (error, resp) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error.code;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "updated successfully";
              data["body"] = resp;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      } else {
        const inData = {
          ethereum_address: params.ethereum_address,
          bitcoin_address: params.bitcoin_address,
        };
        sql.query(
          "insert into admin_settings set ?",
          [inData],
          (error, resp1) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error.code;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "Added Successfully";
              data["body"] = resp1;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      }
    }
  });
};

Admin.addRoyality = (params, result) => {
  var data = {};
  sql.query("select * from admin_settings where id = ?", [2], (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      if (res.length > 0) {
        const upData = {
          royality: params.royality,
          token: params.token,
        };
        sql.query(
          "update admin_settings set ? where id = ?",
          [upData, 2],
          (error, resp) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error.code;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "updated successfully";
              data["body"] = resp;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      } else {
        const inData = {
          royality: params.royality,
          token: params.token,
        };
        sql.query(
          "insert into admin_settings set ?",
          [inData],
          (error, resp1) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error.code;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "Added Successfully";
              data["body"] = resp1;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      }
    }
  });
};

Admin.getWallet = (result) => {
  var data = {};
  sql.query("select * from admin_settings", (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      const newValue = {
        eth_address: res[0].ethereum_address,
        bitcoin_address: res[0].bitcoin_address,
        royality: res[1].royality,
        token: res[1].token,
      };

      data["error"] = false;
      data["msg"] = "Get Successfully";
      data["body"] = newValue;
      dbFunc.connectionRelease;
      result(null, data);
    }
  });
};

// Admin.getRoyality = (result) => {
//   var data = {};
//   sql.query("select * from admin_settings where id = ?", [2], (error, res) => {
//     if (error) {
//       data["error"] = true;
//       data["msg"] = error;
//       data["body"] = [];
//       result(null, data);
//     } else {
//       data["error"] = false;
//       data["msg"] = "Get Successfully";
//       data["body"] = res;
//       dbFunc.connectionRelease;
//       result(null, data);
//     }
//   });
// };

Admin.addRoadmap = (params, result) => {
  var data = {};
  const insertedData = {
    header_title: params.header_title,
    description: params.description,
    bottom_title: params.bottom_title,
  };
  sql.query(
    "insert into roadmap_details set ?",
    [insertedData],
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Inserted Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.editRoadmap = (params, result) => {
  var data = {};
  const upData = {
    header_title: params.header_title,
    description: params.description,
    bottom_title: params.bottom_title,
  };
  sql.query(
    "update roadmap_details set ? where id = ?",
    [upData, params.id],
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Updated Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.deleteRoadmap = (params, result) => {
  var data = {};
  sql.query(
    "update roadmap_details set is_deleted = '1' where id = ?",
    [params.id],
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Deleted Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};
Admin.getAllRoadmap = (result) => {
  var data = {};
  sql.query(
    "select * from roadmap_details where is_deleted = '0'",
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Get Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.addFAQ = (params, result) => {
  var data = {};
  const insertedData = {
    question: params.question,
    answer: params.answer,
    order_1: params.order,
  };
  sql.query("insert into faq_details set ?", [insertedData], (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      data["error"] = false;
      data["msg"] = "Inserted Successfully";
      data["body"] = res;
      result(null, data);
    }
  });
};

Admin.editFAQ = (params, result) => {
  var data = {};
  const upData = {
    question: params.question,
    answer: params.answer,
    order_1: params.order,
  };
  sql.query(
    "update faq_details set ? where id = ?",
    [upData, params.id],
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Updated Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.deleteFAQ = (params, result) => {
  var data = {};
  sql.query(
    "update faq_details set is_deleted = '1' where id = ?",
    [params.id],
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Deleted Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.getAllFAQ = (result) => {
  var data = {};
  sql.query(
    "select * from faq_details where is_deleted = '0'",
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Get Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.addTeam = (params, result) => {
  var data = {};
  const insertedData = {
    facebook: params.facebook,
    insta: params.insta,
    twitter: params.twitter,
    linkedin: params.linkedin,
    name: params.name,
    position: params.position,
    order: params.order,
    filepath: params.filepath,
  };
  sql.query("insert into team_details set ?", [insertedData], (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      data["error"] = false;
      data["msg"] = "Inserted Successfully";
      data["body"] = res;
      result(null, data);
    }
  });
};

Admin.editTeam = (params, result) => {
  var data = {};
  const upData = {
    facebook: params.facebook,
    insta: params.insta,
    twitter: params.twitter,
    linkedin: params.linkedin,
    name: params.name,
    position: params.position,
    order: params.order,
  };
  if (params.filepath) {
    upData.filepath = params.filepath;
  }
  sql.query(
    "update team_details set ? where id = ?",
    [upData, params.id],
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Updated Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.deleteTeam = (params, result) => {
  var data = {};
  sql.query(
    "update team_details set is_deleted = '1' where id = ?",
    [params.id],
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Deleted Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.getAllTeam = (result) => {
  var data = {};
  sql.query(
    "select * from team_details where is_deleted = '0'",
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Get Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.addComicDesc = (params, result) => {
  var data = {};

  sql.query("select * from comic_description", (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      if (res.length > 0) {
        const upData = {
          header: params.header,
          body: params.body_desc,
        };
        sql.query(
          "update comic_description set ? where id = ?",
          [upData, res[0].id],
          (err, resp) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error;
              data["body"] = [];
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "Updated Successfully";
              data["body"] = resp;
              result(null, data);
            }
          }
        );
      } else {
        const insertedData = {
          header: params.header,
          body: params.body_desc,
        };
        sql.query(
          "insert into comic_description set ?",
          [insertedData],
          (error, res) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error;
              data["body"] = [];
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "Inserted Successfully";
              data["body"] = res;
              result(null, data);
            }
          }
        );
      }
    }
  });
};

Admin.getAllComicDesc = (result) => {
  var data = {};
  sql.query(
    "select * from comic_description where is_deleted = '0'",
    (error, res) => {
      if (error) {
        data["error"] = true;
        data["msg"] = error;
        data["body"] = [];
        result(null, data);
      } else {
        data["error"] = false;
        data["msg"] = "Get Successfully";
        data["body"] = res;
        result(null, data);
      }
    }
  );
};

Admin.addDocumentryVideo = (params, result) => {
  var data = {};
  console.log("paramsparamsparamsparams>>>>>>>>", params);
  // return;
  sql.query("select * from documentry_banner_video", (error, res) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      result(null, data);
    } else {
      if (res.length > 0) {
        let updatedData = {
          title: params.title,
          description: params.description,
          video_url: params.filepath,
        };
        sql.query(
          "update documentry_banner_video set ? where id= ?",
          [updatedData, res[0].id],
          (error, resp) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "updated successfully";
              data["body"] = resp;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      } else {
        let insertData = {
          title: params.title,
          description: params.description,
          video_url: params.filepath,
        };
        sql.query(
          "insert into documentry_banner_video set ?",
          [insertData],
          (error, resp1) => {
            if (error) {
              data["error"] = true;
              data["msg"] = error;
              data["body"] = [];
              dbFunc.connectionRelease;
              result(null, data);
            } else {
              data["error"] = false;
              data["msg"] = "Added Successfully";
              data["body"] = resp1;
              dbFunc.connectionRelease;
              result(null, data);
            }
          }
        );
      }
    }
  });
};

Admin.getDocumentryVideo = (result) => {
  var data = {};
  sql.query("select * from documentry_banner_video", (error, resp1) => {
    if (error) {
      data["error"] = true;
      data["msg"] = error;
      data["body"] = [];
      dbFunc.connectionRelease;
      result(null, data);
    } else {
      data["error"] = false;
      data["msg"] = "Fetched Successfully";
      data["body"] = resp1;
      dbFunc.connectionRelease;
      result(null, data);
    }
  });
};

module.exports = Admin;
