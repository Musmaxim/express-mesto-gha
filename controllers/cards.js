const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
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
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.user._id;
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (!card.owner.equals(id)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const id = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Нет пользователя с переданным ID'))
    .then((dataCard) => res.status(200).send({ data: dataCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Некорректный ID'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Нет пользователя/карточки с переданным ID'));
      } else {
        next(err);
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
    .orFail(() => new NotFoundError('Нет пользователя с переданным ID'))
    .then((dataCard) => res.status(200).send({ data: dataCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Некорректный ID'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Нет пользователя/карточки с переданным ID'));
      } else {
        next(err);
      }
    });
};
