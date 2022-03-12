const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const { validateUser, validateLogin } = require('./middlewares/validations');
const { NotFoundError } = require('./errors/NotFoundError');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);

app.use(auth);

app.use('/users', routerUser);
app.use('/cards', routerCards);
app.use(() => {
  throw new NotFoundError('Страница не найдена');
});

app.listen(PORT, () => {});
