const mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      validator = require('validator'),
      Schema = mongoose.Schema,
      SALT_FACTORY_WORK = 10,
      SECRET_TOKEN = 'secretToken';

const AccountSchema = new Schema({
  username: {
    type: String,
    maxLength: [30, 'The maximum length of username is 30 characters'],
    required: [true, 'Username is required'],
  },
  password: {
    type: String,
    validate(val) {
      if (validator.contains(val, 'password') || validator.contains(val, '12345678')) {
        throw new Error("Don't put `password` or `12345678` in your password!!!");
      }
      if (val.length < 8) {
        throw new Error('The minimum length of password is 8 characters');
      }
      if (val.length > 20) {
        throw new Error('The maximum length of password is 20 characters');
      }
    },
    required: [true, 'Password is required']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'account'
});

AccountSchema.pre('save', async function(next) {
  let account = this;
  if (!account.isModified('password')) return next();
  account.password = await bcrypt.hash(account.password, SALT_FACTORY_WORK);
  next();
});

AccountSchema.methods.createToken = (err, next) => {
  if (err) return next(err);
  let payload = {username: this.username};
  let token = jwt.sign(payload, SECRET_TOKEN);
  return token;
};

const Account = mongoose.model('account', AccountSchema);

module.exports = Account;