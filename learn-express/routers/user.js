const express = require('express'),
      bcrypt = require('bcrypt'),
      _ = require('lodash'),
      router = express.Router(),
      moment = require('moment'),
      User = require('../models/user'),
      checkLogin = require('../middleware/auth');

router.get('/:id', checkLogin, async (req, res, next) => {
  let id = req.params.id;
  const user = await User.findById(id);

  try {
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'Not found User'
      });
    }

    res.json({
      status: 'success',
      message: 'Get detail successful',
      data: user
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  let objParam = _.pickBy(req.query, _.identity);
  let pageOptions = {
    page: parseInt(req.query.page) || 1,
    limit: 10
  }

  try {
    const users = await User.find(objParam)
                            .limit(pageOptions.limit)
                            .skip(pageOptions.limit * (pageOptions.page - 1));
    res.json({
      status: 'success',
      message: 'Get list successful',
      data: users
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  let objBody = _.pickBy(req.body, _.identity);
  const userExist = await User.findOne({
    username: objBody.username
  });

  try {
    if (userExist) {
      throw {
        status: 409,
        message: 'User has exist'
      }
    }

    let user = await new User(objBody);
    await user.save();
    res.json({
      status: 'success',
      message: 'Create success'
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', checkLogin, async (req, res, next) => {
  let id = req.params.id;
  let objBody = _.pickBy(req.body, _.identity);
  objBody.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  let keys = Object.keys(objBody);
  const user = await User.findById(id);

  try {
    if (!user) {
      throw {
        status: 404,
        message: 'Not found...'
      }
    }

    keys.forEach(key => {
      user[key] = objBody[key];
    });
    await user.save();
    res.json({
      status: 'success',
      message: 'Update success'
    });
  } catch(err) {
    next(err);
  }
});

router.delete('/all', async (req, res, next) => {
  try {
    await User.deleteMany();
    res.json({
      status: 'success',
      message: 'Delete all success'
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  let id = req.body.id;

  try {
    await User.deleteOne({}, {_id: id});
    res.json({
      status: 'success',
      message: 'Delete success'
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  let objBody = _.pickBy(req.body, _.identity);
  const user = await User.findOne({username: objBody.username});

  try {
    if (!user) {
      throw {
        status: 404,
        message: 'Not found...'
      }
    }

    let hashPass = await bcrypt.compare(objBody.password, user.password);
    if (!hashPass) {
      throw {
        status: 409,
        message: 'Password is wrong...'
      }
    }

    let token = user.createToken();
    res.json({
      status: 'success',
      message: `Login success. Welcome ${user.username}`,
      token: token
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;