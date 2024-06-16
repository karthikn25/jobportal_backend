const express = require("express");
const { User, generateToken } = require("../Models/users.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { Notes } = require("../Models/notes.js");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!req.body.name || !req.body.email || !req.body.password) {
      res.status(400).json({ message: "All credentials are Required" });
    }
    if (user) {
      res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    }).save();

    const token = generateToken(user._id);

    res.status(200).json({ message: "Signup successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!req.body.email || !req.body.password) {
      res.status(400).json({ message: "All Credentials are Required" });
    }
    if (!user) {
      res.status(400).json({ message: "User not Exists" });
    }
    const verify = await bcrypt.compare(req.body.password, user.password);
    if (!verify) {
      res.status(400).json({ message: "Password Incorrect" });
    }
    const token = generateToken(user._id);

    res.status(200).json({ message: "Signin Successfully", token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Forget password

router.post("/forget-password", async (req, res) => {
  try {
    let userData = await User.findOne({ email: req.body.email });
    if (!userData) {
      res.status(400).json({ message: "User Not Exist" });
    }
    if (!req.body.email) {
      res.status(400).json({ message: "Email Required" });
    }
    const secret = userData.password + process.env.secretKey;
    const token = jwt.sign(
      { _id: userData._id, email: userData.email },
      secret,
      {
        expiresIn: "5m",
      }
    );
    const link = `http://localhost:3000/reset/${userData._id}/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.Mail,
        pass: process.env.Mail_Password,
      },
    });
    let details = {
      from: process.env.USER,
      to: req.body.email,
      subject: "Reset Password",
      text: link,
    };
    transporter.sendMail(details, (err) => {
      if (err) {
        console.log("Error In Send Email", err);
      }
      console.log("Email send");
    });
    res.json(link);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/reset/:id/:token", async (req, res) => {
  try {
    let { password } = req.body;
    let { token } = req.params;

    let userData = await User.findOne({ _id: req.params.id });
    if (!userData) {
      res.status(400).json({ message: "user doesn't exists" });
    }
    const secret = userData.password + process.env.secretKey;
    const verify = jwt.verify(token, secret);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    res
      .status(200)
      .json({
        message: "Password Reset Successfully",
        email: verify.email,
        status: "verified",
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// getall user

router.get("/getall", async (req, res) => {
  try {
    let user = await User.find({});
    if (!user) {
      res.status(400).json({ message: "Users Data not Found" });
    }
    res.status(200).json({ message: "Users Data Found Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get single user

router.get("/getuser/:id", async (req, res) => {
  try {
    let user = await User.findById({ _id: req.params.id });
    if (!user) {
      res.status(400).json({ message: "User doesn't exists" });
    }
    res.status(200).json({ message: "user found successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// edit user

router.put("/edit/:id", upload.single("avatar"), async (req, res) => {
  try {
    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get("host")}`;
    }
    if (req.file) {
      avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    }
    let user = await User.findByIdAndUpdate(
      req.params.id,

      {
        ...req.body,
        avatar,
      },

      { new: true }
    );
    if (!user) {
      res.status(400).json({ message: "Error Occured in User Update" });
    }
    res.status(200).json({ message: "User Update Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const userRouter = router;

module.exports = { userRouter };
