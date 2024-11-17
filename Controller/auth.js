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
// const jwt = require('jsonwebtoken');
// const { User } = require('../Models/users.js');  // Importing User model

// const isAuth = async (req, res, next) => {
//   // Retrieve the token from the headers
//   const token = req.headers["x-auth-token"];

//   // If no token is found, return an access denied message
//   if (!token) {
//     return res.status(400).json({ message: "Access denied. No token provided" });
//   }

//   try {
//     // Verify the token using JWT_SECRET
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach the user information to the request object
//     req.user = await User.findById(decoded.id).select("name email _id");

//     // If the user does not exist, return a 404 error
//     if (!req.user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error("Authorization error:", error);
    
//     // Return a 400 error if the token is invalid
//     return res.status(400).json({ message: "Invalid Authorization" });
//   }
// };

// module.exports = { isAuth };

const jwt = require('jsonwebtoken');
const { User } = require('../Models/users.js');  // Importing User model

const isAuth = async (req, res, next) => {
  // Retrieve the token from the headers
  const token = req.headers["x-auth-token"];

  // If no token is found, return an access denied message
  if (!token) {
    console.error("No token provided");
    return res.status(400).json({ message: "Access denied. No token provided" });
  }

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user information to the request object
    req.user = await User.findById(decoded.id).select("name email _id");

    // If the user does not exist, return a 404 error
    if (!req.user) {
      console.error("User not found with id:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Authorization error:", error);
    
    // Return a 400 error if the token is invalid
    return res.status(400).json({ message: "Invalid Authorization" });
  }
};

module.exports = { isAuth };
