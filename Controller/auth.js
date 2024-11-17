// const jwt = require('jsonwebtoken');
// const {User}=require('../Models/users.js');



// const isAuth = async (req, res, next) => {
//   let token;

//   if (req.headers) {
//     try {
//       token = req.headers["x-auth-token"];
//       const decode = jwt.verify(token, process.env.secretKey);
//       req.user = await User.findById(decode.id).select("name email _id");
//       next();
//     } catch (error) {
//       return res.status(400).json({ message: "Invalid Authorization" });
//     }
//     if (!token) {
//       return res.staus(400).json({ message: "Access denied" });
//     }
//   }
// };


// module.exports={ isAuth };
const jwt = require('jsonwebtoken');
const { User } = require('../Models/users.js');  // Importing User model

const isAuth = async (req, res, next) => {
  let token;

  // Check if token is present in the request header
  if (req.headers && req.headers["x-auth-token"]) {
    try {
      token = req.headers["x-auth-token"];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user data to the request object
      req.user = await User.findById(decoded.id).select("name email _id")

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Proceed to the next middleware/route handler
      next();

    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Invalid Authorization" });  // Invalid token or error in decoding
    }
  } else {
    return res.status(400).json({ message: "Access denied. No token provided" });  // Token not provided
  }
};

module.exports = { isAuth };
