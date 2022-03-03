const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Account = require('../models/account');
const _ = require('lodash');

router.get('/:id', async (req, res) => {
  let id = req.params.id;
  const account = await Account.findById(id);

  try {
    if (account) {
      res.json({
        status: 'success',
        message: 'Get detail account successful',
        data: account
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Not found account'
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: 'error',
      message: 'Have error while getting detail account...'
    });
  }
});

router.get('/', async (req, res) => {
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
    console.log(err);
    res.status(409).json({
      status: 'error',
      message: 'Have error while getting list account...'
    });
  }
});

router.post('/', async (req, res) => {
  let objBody = _.pickBy(req.body, _.identity);
  const accountExist = await Account.findOne({
    username: objBody.username
  });

  try {
    if (!accountExist) {
      let account = await new Account(objBody);
      await account.save();
      res.json({
        status: 'success',
        message: 'Create account success'
      });
    } else {
      res.status(409).json({
        status: 'error',
        message: 'Account has exist'
      });
    }
  } catch (err) {
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        res.status(409).json({
          status: 'error',
          message: err.errors[key].message
        });
      });
    }

    console.log(err);
    res.status(409).json({
      status: 'error',
      message: 'Have error while creating account...'
    });
  }
});

router.put('/:id', async (req, res) => {
  let id = req.params.id;
  let objBody = _.pickBy(req.body, _.identity);
  let keys = Object.keys(objBody);
  const account = await Account.findById(id);

  try {
    if (account) {
      keys.forEach(key => {
        account[key] = objBody[key];
      });
      await account.save();
      res.json({
        status: 'success',
        message: 'Update account success'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Not found account'
      });
    }
  } catch(err) {
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        res.status(409).json({
          status: 'error',
          message: err.errors[key].message
        });
      });
    }

    console.log(err);
    res.status(409).json({
      status: 'error',
      message: 'Have error while updating account...'
    });
  }
});

router.delete('/:id', async (req, res) => {
  let id = req.body.id;

  try {
    await Account.deleteOne({}, {_id: id});
    res.json({
      status: 'success',
      message: 'Delete account successful'
    });
  } catch (err) {
    console.log(err);
    res.status(409).json({
      status: 'error',
      message: 'Have error while deleting account...'
    });
  }
});

router.post('/login', async (req, res) => {
  let objBody = _.pickBy(req.body, _.identity);
  const account = await Account.findOne({username: objBody.username});

  try {
    if (account) {
      let hashPass = await bcrypt.compare(objBody.password, account.password);
      if (hashPass) {
        res.json({
          status: 'success',
          message: `Login successful. Welcome ${account.username}`
        });
      } else {
        res.status(409).json({
          status: 'error',
          message: 'Password is wrong!!'
        });
      }
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Not found account'
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({
      status: 'error',
      message: 'Have error while logging...'
    });
  }
});

module.exports = router;