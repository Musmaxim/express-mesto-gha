const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      res.status(500).send({ message: `Запрашиваемый ресурс не найден ${err}` });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('Не найдено'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введён неправильный id' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const createUser = (req, res) => {
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

const updateUser = (req,res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id,{ name, about },
    {new: true, runValidators: true},
  )
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка валидации' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  });
}

const updateAvatar = (req,res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id,{ avatar },
    {new: true, runValidators: true},
  )
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка валидации' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
};