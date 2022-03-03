const mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      Schema = mongoose.Schema,
      SALT_FACTORY_WORK = 10;

const AccountSchema = new Schema({
  username: {
    type: String,
    maxLength: [30, 'The maximum length of username is 30 characters'],
    required: [true, 'Username is required'],
  },
  password: {
    type: String,
    minLength: [8, 'The minimum length of password is 8 characters'],
    maxLength: [20, 'The maximum length of password is 20 characters'],
    required: [true, 'Password is required']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'account'
});

AccountSchema.pre('save', function(next) {
  let account = this;

  if (!account.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTORY_WORK, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(account.password, salt, function(err, hash) {
      if (err) return next(err);

      account.password = hash;
      next();
    });
  });
});

const Account = mongoose.model('account', AccountSchema);

module.exports = Account;