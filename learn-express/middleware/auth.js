const jwt = require('jsonwebtoken'),
      Account = require('../models/user'),
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

    let account = await Account.findOne({username: decoded.username});
    if (!account) {
      throw new Error("This isn't account...");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkLogin;