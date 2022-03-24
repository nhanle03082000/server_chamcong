const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// mongodb user model
const User = require("../model/User");

// Password handler
const bcrypt = require("bcrypt");
const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

router.post("/signup", async (req, res) => {
  const {
    course,
    username,
    password: plainTextPassword,
    macAddress,
    uniqueId,
  } = req.body;
  let check = new RegExp("GCC|d{5}$");
  if (
    course == "" ||
    username == "" ||
    plainTextPassword == "" ||
    macAddress == "" ||
    uniqueId == ""
  ) {
    return res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  }
  if (!/^(?=[a-zA-Z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username)) {
    return res.json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  }
  if (!check.test(course)) {
    return res.json({
      status: "FAILED",
      message: "GCCXXXXX",
    });
  }
  if (plainTextPassword.length < 8) {
    return res.json({
      status: "FAILED",
      message: "Password is too short!",
    });
  }
  // Checking if user already exists

  const password = await bcrypt.hash(plainTextPassword, 10);

  const user = await User.find({ username });
  // console.log("user", user);
  const ckeckResigter = user.length;
  console.log("HELLO", ckeckResigter);

  try {
    if (ckeckResigter == 0) {
      const UniID = await User.find({ uniqueId });
      const checkUniID = UniID.length;
      console.log(checkUniID);
      if (checkUniID == 0) {
        const macAdd = await User.find({ macAddress });
        const checkmacAdd = macAdd.length;
        if (checkmacAdd == 0) {
          const response = await User.create({
            course,
            username,
            password,
            macAddress,
            uniqueId,
          });
          response.save().then((result) => {
            res.json({
              status: "SUCCESS",
              message: "Signup successful",
              data: result,
            });
          });
          console.log("User created successfully: ", response);
        } else {
          res.json({
            status: "FAILED",
            error: "MacAddress  already in use",
          });
        }
      } else {
        res.json({
          status: "FAILED",
          message: "UniqueID  already in use",
        });
      }
    } else {
      res.json({ status: "FAILED", message: "Username already in use" });
    }
  } catch (error) {
    if (error) {
      // duplicate key
      // return res.json({ status: "error", error: "MacAdress already in use" });
      console.error(error);
    }
    throw error;
  }
});

router.post("/singin", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Username does not exist" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        course: user.course,

        macAddress: user.macAddress,
        uniqueId: user.uniqueId,
      },
      JWT_SECRET
    );

    return res.json({
      status: "ok",
      user: {
        id: user._id,
        username: user.username,
        course: user.course,

        macAddress: user.macAddress,
        uniqueId: user.uniqueId,
      },
    });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});
module.exports = router;
