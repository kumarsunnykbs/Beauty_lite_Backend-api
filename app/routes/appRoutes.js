"use strict";
module.exports = function (app) {
  var userAuth = require("../controllers/authController");
  var userInformation = require("../controllers/userController");
  var admin = require("../controllers/adminController");
  var exchange = require("../controllers/exchangeController");
  //User Login/register

  app.get("/", function (req, res, next) {
    res.send("Welcome to Beauty_Lite");
  });

  app.route("/register").post(userAuth.register);
  app.route("/login").post(userAuth.login);

  app.route("/getDashboardStats").get(userInformation.getDashboardStats);
  app.route('/getallnft').post(userInformation.getallnft);
  app.route('/addWalletHistory').post(userInformation.addWalletHistory);
  app.route("/getNfthistory/").get(exchange.getNfthistory);


  
  app.route("/addNft").post(admin.addNft);
  app.route("/updateNFTDetails").post(admin.updateNFTDetails);
  app.route("/getAllNfts").get(admin.getAllNfts);
  app.route("/delete/:id").post(admin.deleteNftById);
  app.route("/addProjectDesc").post(admin.addProjectDesc);
  app.route("/getProjectDesc").get(admin.getProjectDesc);
  app.route("/addVideos").post(admin.addVideos);
  app.route("/getVideos").get(admin.getVideos);
  app.route("/addVedioSets").post(admin.addVedioSets);
  app.route("/addComics").post(admin.addComics);
  app.route("/editComics").post(admin.editComics);
  app.route("/nftBulkImport").post(admin.nftBulkImport);
  app.route('/addWallet').post(admin.addWallet);
  app.route('/addRoyality').post(admin.addRoyality);
  app.route('/getWalletDetails').get(admin.getWallet);

  //roadmap section
  app.route('/addRoadmap').post(admin.addRoadmap);
  app.route('/editRoadmap').post(admin.editRoadmap);
  app.route('/deleteRoadmap/:id').post(admin.deleteRoadmap);
  app.route('/getAllRoadmap').get(admin.getAllRoadmap );


//FAQ section
  app.route('/addFAQ').post(admin.addFAQ);
  app.route('/editFAQ').post(admin.editFAQ);
  app.route('/deleteFAQ/:id').post(admin.deleteFAQ);
  app.route('/getAllFAQ').get(admin.getAllFAQ);

  //Team section
  app.route('/addTeam').post(admin.addTeam);
  app.route('/editTeam').post(admin.editTeam);
  app.route('/deleteTeam/:id').post(admin.deleteTeam);
  app.route('/getAllTeam').get(admin.getAllTeam);

  //documentry video routes
  app.route('/addDocumentryVideo').post(admin.addDocumentryVideo);
  app.route('/getDocumentryVideo').get(admin.getDocumentryVideo);

  //comic description section
  app.route('/addComicDesc').post(admin.addComicDesc);
    app.route('/getAllComicDesc').get(admin.getAllComicDesc);
};