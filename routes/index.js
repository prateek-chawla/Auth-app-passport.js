const express = require("express");
const router = express.Router();

const isAuth = require("../config/passport-auth").isAuth;

const homeController = require("../controllers/home-controller");

router.get("/", isAuth, homeController.getHome);

module.exports = router;
