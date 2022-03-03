const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost/my_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connect database successfully!!');
  } catch(err) {
    console.log('Connect database failure!!');
  }
}

module.exports = { connect };