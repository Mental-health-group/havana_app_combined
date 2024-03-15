const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/BaseUserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/findUserId", UserController.findUser);
router.get("/getUsers", UserController.getUsers);
router.put("/update", UserController.update);
module.exports = router;
