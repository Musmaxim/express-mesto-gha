const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => { res.status(200).send({ users }); })
    .catch((err) => {
      res.status(500).send({ message: `Запрашиваемый ресурс не найден ${err}` });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => { res.status(200).send({ user }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Нет пользователя/карточки с переданным ID' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateUser = (req, res) => {
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
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный ID' });
      }

      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
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
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный ID' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};
