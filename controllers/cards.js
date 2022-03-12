const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные при создании карточки'));
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((Datacard) => res.status(200).send(Datacard))
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

module.exports.likeCard = (req, res, next) => {
  const id = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((dataCard) => res.status(200).send({ data: dataCard }))
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

module.exports.dislikeCard = (req, res, next) => {
  const id = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((dataCard) => res.status(200).send({ data: dataCard }))
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
