// const express = require("express");
// const { User, generateToken } = require("../Models/users.js");
// const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const { Notes } = require("../Models/notes.js");

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname, "..", "uploads/user"));
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   }),
// });

// const router = express.Router();

// router.post("/signup", async (req, res) => {
//   try {
//     let user = await User.findOne({ email: req.body.email });

//     if (!req.body.name || !req.body.email || !req.body.password) {
//       res.status(400).json({ message: "All credentials are Required" });
//     }
//     if (user) {
//       res.status(400).json({ message: "User already exists" });
//     }
//     const salt = await bcrypt.genSalt(10);

//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     user = await new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword,
//     }).save();

//     const token = generateToken(user._id);

//     res.status(200).json({ message: "Signup successfully", token });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     let user = await User.findOne({ email: req.body.email });
//     if (!req.body.email || !req.body.password) {
//       res.status(400).json({ message: "All Credentials are Required" });
//     }
//     if (!user) {
//       res.status(400).json({ message: "User not Exists" });
//     }
//     const verify = await bcrypt.compare(req.body.password, user.password);
//     if (!verify) {
//       res.status(400).json({ message: "Password Incorrect" });
//     }
//     const token = generateToken(user._id);

//     res.status(200).json({ message: "Signin Successfully", token, user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Forget password

// router.post("/forget-password", async (req, res) => {
//   try {
//     let userData = await User.findOne({ email: req.body.email });
//     if (!userData) {
//       res.status(400).json({ message: "User Not Exist" });
//     }
//     if (!req.body.email) {
//       res.status(400).json({ message: "Email Required" });
//     }
//     const secret = userData.password + process.env.secretKey;
//     const token = jwt.sign(
//       { _id: userData._id, email: userData.email },
//       secret,
//       {
//         expiresIn: "5m",
//       }
//     );
//     const link = `http://localhost:3000/reset/${userData._id}/${token}`;
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       secure: false,
//       auth: {
//         user: process.env.Mail,
//         pass: process.env.Mail_Password,
//       },
//     });
//     let details = {
//       from: process.env.USER,
//       to: req.body.email,
//       subject: "Reset Password",
//       text: link,
//     };
//     transporter.sendMail(details, (err) => {
//       if (err) {
//         console.log("Error In Send Email", err);
//       }
//       console.log("Email send");
//     });
//     res.json(link);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.put("/reset/:id/:token", async (req, res) => {
//   try {
//     let { password } = req.body;
//     let { token } = req.params;

//     let userData = await User.findOne({ _id: req.params.id });
//     if (!userData) {
//       res.status(400).json({ message: "user doesn't exists" });
//     }
//     const secret = userData.password + process.env.secretKey;
//     const verify = jwt.verify(token, secret);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const user = await User.findOneAndUpdate(
//       { _id: req.params.id },
//       {
//         $set: {
//           password: hashedPassword,
//         },
//       }
//     );
//     res
//       .status(200)
//       .json({
//         message: "Password Reset Successfully",
//         email: verify.email,
//         status: "verified",
//         user,
//       });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // getall user

// router.get("/getall", async (req, res) => {
//   try {
//     let user = await User.find({});
//     if (!user) {
//       res.status(400).json({ message: "Users Data not Found" });
//     }
//     res.status(200).json({ message: "Users Data Found Successfully", user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // get single user

// router.get("/getuser/:id", async (req, res) => {
//   try {
//     let user = await User.findById({ _id: req.params.id });
//     if (!user) {
//       res.status(400).json({ message: "User doesn't exists" });
//     }
//     res.status(200).json({ message: "user found successfully", user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // edit user

// router.put("/edit/:id", upload.single("avatar"), async (req, res) => {
//   try {
//     let avatar;
//     let BASE_URL = process.env.BACKEND_URL;
//     if (process.env.NODE_ENV === "production") {
//       BASE_URL = `${req.protocol}://${req.get("host")}`;
//     }
//     if (req.file) {
//       avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
//     }
//     let user = await User.findByIdAndUpdate(
//       req.params.id,

//       {
//         ...req.body,
//         avatar,
//       },

//       { new: true }
//     );
//     if (!user) {
//       res.status(400).json({ message: "Error Occured in User Update" });
//     }
//     res.status(200).json({ message: "User Update Successfully", user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// const userRouter = router;

// module.exports = { userRouter };
const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require('multer');
const {generateToken} = require('../Models/users')
const { User } = require('../Models/users');
const cloudinary = require('cloudinary').v2;

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const uploads = multer({ storage });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Temporary OTP store (in-memory, should be replaced with DB in production)
const tempOtpStore = {};

// Routes

// Register route with OTP
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }

      // Validate input
      if (!name || !email || !password) {
          return res.status(400).json({ msg: 'Please provide username, email, and password' });
      }

      // Generate OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const otpExpires = Date.now() + 300000; // OTP expires in 5 minutes

      // Send OTP email (use async/await for waiting for the email to be sent)
      const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'OTP for account verification',
          text: `Your OTP is ${generatedOtp}`,
      };

      const hashedPassword = await bcrypt.hash(password, 10);

      // Wrapping sendMail in a promise to await its completion
      const sendMailPromise = new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(info);
              }
          });
      });

      // Wait for email to be sent
      await sendMailPromise;

      // Store the OTP and user data temporarily (to be used later for verification)
      tempOtpStore[email] = {
          otp: generatedOtp,
          otpExpires,
          name,  // saving the name directly
          email,
          password: hashedPassword,
      };

      // Respond to client after email is sent
      res.status(200).json({ msg: 'OTP sent to email' });

  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


// OTP verification route
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const tempUser = tempOtpStore[email];
        if (!tempUser || tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        // Create user after OTP verification
        const user = new User({
            name: tempUser.name,
            email: tempUser.email,
            password: tempUser.password,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete tempOtpStore[email]; // Remove OTP after verification

        res.status(200).json({ msg: 'User registered successfully', token, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All credentials are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({ message: "Password incorrect" });
        }

        const token = generateToken(user._id);
        return res.status(200).json({ message: "Login successfully", token, user });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Forget Password (Send reset link)
router.post("/forget", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (!req.body.email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const secret = user.password + process.env.JWT_SECRET;
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            secret,
            { expiresIn: "5m" }
        );
        const link = `http://localhost:3000/reset/${user._id}/${token}`;
        const details = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "Reset Password",
            text: link
        };
        transporter.sendMail(details, (err) => {
            if (err) {
                console.log("Error occurred in sending Email", err);
            }
            console.log("Reset password email sent successfully");
        });
        res.json(link);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Reset Password route
router.put("/reset-password/:id/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        let userData = await User.findOne({ _id: req.params.id });
        if (!userData) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const secret = userData.password + process.env.JWT_SECRET;
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

        res.status(200).json({ message: "Password Reset Successfully", email: verify.email, status: "verified", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all users
router.get("/allusers", async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            return res.status(400).json({ message: "No users found" });
        }
        res.status(200).json({ message: "Users found successfully", users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get single user
router.get("/getuser/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id); 
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User found successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete user
router.delete("/remove/:id", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(400).json({ message: "User deletion failed" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Edit user with avatar upload to Cloudinary
router.put("/edit/:id", uploads.single("avatar"), async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        let avatarUrl;
        if (req.file) {
            avatarUrl = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    resource_type: "image",
                    folder: 'users',
                }, (error, result) => {
                    if (error) {
                        return reject(new Error("Cloudinary upload error."));
                    }
                    resolve(result.secure_url);
                });
                uploadStream.end(req.file.buffer);
            });
        }

        user.username = req.body.username || user.username;
        if (avatarUrl) {
            user.avatar = avatarUrl; // Update the avatar URL
        }

        const updatedUser = await user.save();
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

const userRouter = router;
module.exports = {userRouter};
