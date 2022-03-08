const jwt = require('jsonwebtoken'),
      User = require('../models/user'),
      SECRET_TOKEN = 'secretToken';

let checkLogin = async (req, res, next) => {
  try {
    let tokenBearer = req.headers.authorization;
    if (!tokenBearer) {
      throw {
        status: 409,
        message: 'Not have token'
      }
    }
    let token = tokenBearer.replace('Bearer ', '');
    let decoded = jwt.verify(token, SECRET_TOKEN);
    let user = await User.findOne({username: decoded.username});
    if (!user) {
      throw new Error("You aren't a user...");
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkLogin;