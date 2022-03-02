const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '621bbd7568ca5e28605edd0c',
  };
  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCards);

app.listen(PORT, () => {});
