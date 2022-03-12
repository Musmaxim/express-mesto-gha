const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const CastError = require('../errors/CastError');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => { res.status(200).send({ users }); })
    .catch((err) => {
      res.status(500).send({ message: `Запрашиваемый ресурс не найден ${err}` });
    });
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => { res.status(200).send({ user }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Некорректный ID'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Нет пользователя/карточки с переданным ID'));
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then(() => res.status(200).send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные при создании пользователя'));
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные при редактировании пользователя'));
      }
      if (err.name === 'CastError') {
        next(new CastError('Некорректный ID'));
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные при обновлении аватара'));
      }
      if (err.name === 'CastError') {
        next(new CastError('Некорректный ID'));
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 604800,
          httpOnly: true,
          sameSite: true,
        });
    })
    .catch(() => {
      next(new AuthorizationError('Неправильная почта или пароль'));
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => { res.status(200).send({ user }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Некорректный ID'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Нет пользователя/карточки с переданным ID'));
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
