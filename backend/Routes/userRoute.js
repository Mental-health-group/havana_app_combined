const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} = require("../Controllers/BaseUserController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/getUsers", getUsers);

module.exports = router;
