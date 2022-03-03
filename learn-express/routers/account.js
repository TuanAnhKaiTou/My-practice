const express = require('express'),
      bcrypt = require('bcrypt'),
      _ = require('lodash'),
      router = express.Router(),
      Account = require('../models/account');

router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  const account = await Account.findById(id);

  try {
    if (!account) {
      res.status(404).json({
        status: 'error',
        message: 'Not found account'
      });
    }

    res.json({
      status: 'success',
      message: 'Get detail account successful',
      data: account
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
    let accounts = await Account.find(objParam)
                                .limit(pageOptions.limit)
                                .skip(pageOptions.limit * (pageOptions.page - 1));
    res.json({
      status: 'success',
      message: 'Get list account successful',
      data: accounts
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  let objBody = _.pickBy(req.body, _.identity);
  const accountExist = await Account.findOne({
    username: objBody.username
  });

  try {
    if (accountExist) {
      throw {
        status: 409,
        message: 'Account has exist'
      }
    }

    let account = await new Account(objBody);
    await account.save();
    res.json({
      status: 'success',
      message: 'Create account success'
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  let id = req.params.id;
  let objBody = _.pickBy(req.body, _.identity);
  let keys = Object.keys(objBody);
  const account = await Account.findById(id);

  try {
    if (!account) {
      throw {
        status: 404,
        message: 'Not found account'
      }
    }

    keys.forEach(key => {
      account[key] = objBody[key];
    });
    await account.save();
    res.json({
      status: 'success',
      message: 'Update account success'
    });
  } catch(err) {
    next(err);
  }
});

router.delete('/all', async (req, res, next) => {
  try {
    await Account.deleteMany();
    res.json({
      status: 'success',
      message: 'Delete all account successful'
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  let id = req.body.id;

  try {
    await Account.deleteOne({}, {_id: id});
    res.json({
      status: 'success',
      message: 'Delete account successful'
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  let objBody = _.pickBy(req.body, _.identity);
  const account = await Account.findOne({username: objBody.username});

  try {
    if (!account) {
      throw {
        status: 404,
        message: 'Not found account'
      }
    }

    let hashPass = await bcrypt.compare(objBody.password, account.password);
    if (!hashPass) {
      throw {
        status: 409,
        message: 'Password is wrong!!'
      }
    }

    let token = account.createToken();
    res.json({
      status: 'success',
      message: `Login successful. Welcome ${account.username}`,
      token: token
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;