const bcrypt = require("bcrypt");
const User = require("../models/User");
const shortid = require("shortid");
const _ = require("lodash");

const loginController = async (req, res, next) => {
  try {
    const body = req.body;
    const { username, password } = body;
    let userObj = await User.findOne({ username: username });
    if (userObj) {
      const hpwd = userObj.password;
      let comp = await bcrypt.compare(password, hpwd);
      if (comp) {
        return res.send({
          result: true,
          user: userObj,
          message: "Logged in successfully",
        });
      }
      return res.send({
        result: false,
        user: null,
        message: "Invalid password",
      });
    } else {
      return res.send({
        result: false,
        user: null,
        message: "Invalid username",
      });
    }
  } catch (err) {
    console.log("Error occurred", err);
    return res.send({ result: false, user: null, message: "Error occurred" });
  }
};

const updateController = async (req, res, next) => {
  try {
    const body = req.body;
    const userObj = await User.findOne({ uid: body.uid });
    userObj.profile = body.profile;
    await userObj.save();
    return res.send({
      result: true,
      user: userObj,
      message: "Updated profile successfully",
    });
  } catch (err) {
    console.log("Error occurred", err);
    return res.send({ result: false, user: null, message: "Error occurred" });
  }
};

const signupController = async (req, res, next) => {
  try {
    const body = req.body;
    const { username, password, type } = body;
    const hashed = await bcrypt.hash(password, 10);
    let userObj = await User.findOne({ username: username });
    if (userObj)
      return res.send({
        result: false,
        user: null,
        message: "Username is already taken",
      });
    userObj = new User({
      username,
      password: hashed,
      type,
      uid: shortid.generate(),
    });
    await userObj.save();
    return res.send({
      result: true,
      user: userObj,
      message: "Account created successfully",
    });
  } catch (err) {
    console.log("Error occurred", err);
    return res.send({ result: false, user: null, message: "Error occurred" });
  }
};

const getUserController = async (req, res, next) => {
  try {
    console.log("here");
    const { uid } = req.params;
    let userObj = await User.findOne({ uid: uid });
    if (userObj) {
      return res.send({
        result: true,
        user: userObj,
      });
    } else {
      return res.send({
        result: false,
        user: null,
      });
    }
  } catch (err) {
    console.log("Error occurred", err);
    return res.send({ result: false, user: null, message: "Error occurred" });
  }
};

const getUsersController = async (req, res, next) => {
  try {
    let users = await User.find({ "profile.name": { $exists: true } });
    const users_obj = _.mapValues(_.keyBy(users, "uid"), (val) => {
      return {
        ...val.profile,
        type: val.type,
        uid: val.uid,
      };
    });
    return res.send({ result: true, users: users_obj });
  } catch (err) {
    console.log("Error occurred", err);
    return res.send({ result: false, users: null });
  }
};

module.exports = {
  loginController,
  signupController,
  updateController,
  getUserController,
  getUsersController,
};
