const router = require('express').Router();
const { validateUserId, validateUpdateUser, validateAvatar } = require('../middlewares/validations');
const {
  getUsers, getUser, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/users/me', getUser);
router.get('/:id', validateUserId, getUserId);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
