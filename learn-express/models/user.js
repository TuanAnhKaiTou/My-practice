const mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      validator = require('validator'),
      moment = require('moment'),
      Schema = mongoose.Schema,
      SALT_FACTORY_WORK = 10,
      SECRET_TOKEN = 'secretToken';

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required...'],
    validate(val) {
      if (!isNaN(val.charAt(0))) {
        throw new Error("Don't use username start with a number...")
      }
      if (!validator.matches(val, /^[\w\s_.]+$/)) {
        throw new Error("Don't put special character in your username...");
      }
      if (val > 30) {
        throw new Error('The maximum length of username is 30 characters...');
      }
    },
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required'],
    validate(val) {
      if (validator.contains(val, 'password') || validator.contains(val, '12345678')) {
        throw new Error("Don't put `password` or `12345678` in your password...");
      }
      if (val.length < 8) {
        throw new Error('The minimum length of password is 8 characters...');
      }
      if (val.length > 20) {
        throw new Error('The maximum length of password is 20 characters...');
      }
    },
  },
  email: {
    type: String,
    trim: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Please check your email...');
      }
    }
  },
  name: {
    type: String,
    trim: true,
    validate(val) {
      if (!validator.matches(val, /^[\sa-zA-ZÀÁÃẢẠÂẤẦẨẪẬĂẮẰẲẴẶÈÉẸẺẼÊỀẾỂỄỆÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴÝỶỸĐàáãạảâấầẩẫậăắằẳẵặèéẹẻẽêềếểễệìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳýỵỷỹđ]*$/)) {
        throw new Error("Please enter your name...");
      }
      if (val.length > 150) {
        throw new Error("Your name is so fucking long...");
      }
    }
  },
  phone: {
    type: String,
    trim: true,
    validate(val) {
      if (!validator.isMobilePhone(val, ['vi-VN', 'en-US'])) {
        throw new Error("Please enter phone of Vietnam or US...");
      }
    }
  },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  date_of_birth: {
    type: String,
    validate(val) {
      if (!validator.isDate(val, ['-'])) {
        throw new Error("Please enter your date of birth...");
      }
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  created_at: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  updated_at: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  }
}, {
  collection: 'user'
});

UserSchema.pre('save', async function(next) {
  let user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, SALT_FACTORY_WORK);
  }
  next();
});

UserSchema.methods.createToken = function(err, next) {
  if (err) return next(err);
  let payload = { username: this.username };
  let token = jwt.sign(payload, SECRET_TOKEN);
  return token;
};

UserSchema.methods.toJSON = function() {
  let user = this;
  const objUSer = user.toObject();
  objUSer.date_of_birth = moment(objUSer.date_of_birth).format('DD-MM-YYYY');

  delete objUSer.password;
  delete objUSer.created_at;
  delete objUSer.updated_at;
  delete objUSer.__v;

  return objUSer;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;