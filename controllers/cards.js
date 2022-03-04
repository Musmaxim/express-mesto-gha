const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((Datacard) => res.status(200).send(Datacard))
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

module.exports.likeCard = (req, res) => {
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
        res.status(400).send({ message: 'Некорректный ID' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Нет пользователя/карточки с переданным ID' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
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
        res.status(400).send({ message: 'Некорректный ID' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Нет пользователя/карточки с переданным ID' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
