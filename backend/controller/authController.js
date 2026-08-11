const { check, validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");
// const user = require('../model/user');
// const session = require('express-session')

const authCheck = async (req, res, next) => {
  if (req.session && req.session.userId) {
    const userData = await User.findOne({ _id: req.session.userId });

    const user = {
      profilePic: userData.profilePic,
      fullName: userData.fullName,
      email: userData.email,
    };
    res.json({ loggedIn: true, user });
  } else {
    res.status(401).json({ loggedIn: false, user: {} });
  }
};
const postLogin = [
  check("email")
    .isEmail()
    .withMessage("Plese enter a valid email")
    .normalizeEmail(),

  // Password validation
  check("password")
    .notEmpty()
    .withMessage("Password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 character long")
    .matches(/[a-z]/)
    .withMessage("Password must contain one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain one uppercase letter")
    .matches(/[!@#$%^&*().,?'":{}|<>]/)
    .withMessage("Password must contain one special characters")
    .trim(),

  check("rememberMe").isBoolean().withMessage("Select the valid checkbox "),

  async (req, res, next) => {
    const errorMsg = {
      email: [],
      password: [],
      extra: [],
    };

    const Error = validationResult(req);
    if (!Error.isEmpty()) {
      console.log(Error.errors);
      Error.errors.map((error) => {
        const path = error.path;
        if (errorMsg[path]) {
          errorMsg[path].push(error.msg);
        }
      });

      return res.status(422).json({
        Status: false,
        errorMsg,
      });
    }

    const { email, password, rememberMe } = req.body;
    const userData = await User.findOne({ email });
    console.log(userData);
    if (!userData) {
      errorMsg.extra.push("User not found");
      return res.status(422).json({
        Status: false,
        errorMsg,
      });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      errorMsg.extra.push("Invalid password");
      return res.status(422).json({
        Status: false,
        errorMsg,
      });
    }

    // req.session.isLoggedIn = true;
    req.session.userId = userData._id.toString();

    console.log("Login successfull : ", email, password, rememberMe);
    res.json({
      Status: true,
    });
  },
];

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ Status: false, message: "Logout failed" });
    }
  });
};
const postSignup = [
  //Fullname validation
  check("Fullname")
    .notEmpty()
    .withMessage("First Name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name must be 2 character long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First Name can only contain letters"),

  //Email validation
  check("Email")
    .isEmail()
    .withMessage("Plese enter a valid email")
    .normalizeEmail(),

  // Password validation
  check("Password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be 8 character long")
    .matches(/[a-z]/)
    .withMessage("Password must contain one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain one uppercase letter")
    .matches(/[!@#$%^&*().,?'":{}|<>]/)
    .withMessage("Password must contain one special characters")
    .trim(),

  //confirm password validation
  check("ConfirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.ConfirmPassword) {
        throw new Error("Password does not matched");
      }
      return true;
    }),

  //Error response in case of validation failed
  async (req, res, next) => {
    const errorMsg = {
      Fullname: [],
      Email: [],
      Password: [],
      ConfirmPassword: [],
    };

    const { Fullname, Email, Password } = req.body;

    const Error = validationResult(req);
    const file = req.file;

    if (!Error.isEmpty()) {
      Error.errors.map((error) => {
        const path = error.path;
        if (errorMsg[path]) {
          errorMsg[path].push(error.msg);
        }
      });

      return res.status(422).json({
        errorMsg,
      });
    }

    const existingUser = await User.find({ email: Email });
    if (existingUser) {
      const hashedPassword = await bcrypt.hash(Password, 12);
      const userData = {
        fullName: Fullname,
        email: Email,
        password: hashedPassword,
      };

      if (file) {
        userData.profilePic = file.path;
      }

      const user = new User(userData);
      await user.save();

      return res.status(200).json({
        successMsg: "Signup SucessFul",
      });
    } else {
      errorMsg.Email.push("User Already Exists");
      return res.status(422).json({
        errorMsg,
      });
    }
  },
];

const postUpdateUser = [
  //Fullname validation
  check("Fullname")
    .notEmpty()
    .withMessage("First Name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name must be 2 character long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First Name can only contain letters"),

  //Email validation
  check("Email")
    .isEmail()
    .withMessage("Plese enter a valid email")
    .normalizeEmail(),

  //Error response in case of validation failed
  async (req, res, next) => {
    const userId = req.session.userId;
    const errorMsg = {
      Fullname: [],
      Email: [],
    };

    const { Fullname, Email, removeImage } = req.body;
    const Error = validationResult(req);
    const file = req.file;

    if (!Error.isEmpty()) {
      console.log(Error.errors);
      Error.errors.map((error) => {
        const path = error.path;
        if (errorMsg[path]) {
          errorMsg[path].push(error.msg);
        }
      });

      return res.status(422).json({
        errorMsg,
      });
    }

    if (req.session && req.session.userId) {
      const USER = await User.findById(userId);

      const updateData = {
        fullName: Fullname,
        email: Email,
      };
      const unsetData = {};
      const shouldRemoveImage = removeImage === true || removeImage === "true";

      if (shouldRemoveImage && USER.profilePic) {
        try {
          await fs.promises.unlink(USER.profilePic);
        } catch (err) {
          // Ignore missing/locked old file and continue profile update.
          console.log("Failed to remove old profile image:", err.message);
        }
        unsetData.profilePic = 1;
      }

      if (file) {
        if (USER.profilePic && !shouldRemoveImage) {
          try {
            await fs.promises.unlink(USER.profilePic);
          } catch (err) {
            // Ignore missing/locked old file and continue profile update.
            console.log("Failed to remove old profile image:", err.message);
          }
        }

        updateData.profilePic = file.path;
        delete unsetData.profilePic;
      }

      const updateQuery = { $set: updateData };
      if (Object.keys(unsetData).length > 0) {
        updateQuery.$unset = unsetData;
      }

      const userData = await User.findOneAndUpdate(
        { _id: req.session.userId },
        updateQuery,
        { returnDocument: "after" },
      );

      if (!userData) {
        return res
          .status(404)
          .json({ loggedIn: false, Status: false, errorMsg });
      }

      const user = {
        profilePic: userData.profilePic,
        fullName: userData.fullName,
        email: userData.email,
      };
      console.log("User Updated successfull :", Fullname, Email, file);
      return res.json({ loggedIn: true, Status: true, user, errorMsg });
    }
    return res
      .status(401)
      .json({ loggedIn: false, Status: false, message: "Not authenticated" });
  },
];

exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.postSignup = postSignup;
exports.authCheck = authCheck;
exports.postUpdateUser = postUpdateUser;
exports.postUpdateUser = postUpdateUser;
