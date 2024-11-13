const jwt = require('jsonwebtoken');
const {User}=require('../Models/users.js');



const isAuth = async (req, res, next) => {
  let token;

  if (req.headers) {
    try {
      token = req.headers["x-auth-token"];
      const decode = jwt.verify(token, process.env.secretKey);
      req.user = await User.findById(decode.id).select("name email _id");
      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid Authorization" });
    }
    if (!token) {
      return res.staus(400).json({ message: "Access denied" });
    }
  }
};


module.exports={ isAuth };
