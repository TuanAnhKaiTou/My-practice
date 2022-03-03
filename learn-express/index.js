const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./config/db');
const accountRouter = require('./routers/account');

db.connect();
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', () => {
  res.json({
    status: 'success',
    message: 'Hello World!',
  });
});

app.use('/user', accountRouter);

app.listen(port, (err) => {
  if (err) {
    console.log(`Error to fire up the server: ${err}`);
    return;
  }
  console.log(`Server start on port ${port}!`)
});