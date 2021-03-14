const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { loginError } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  // const { authorization } = req.headers.authorization;
  // убеждаемся, что он есть или начинается с Bearer
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.log('1');
    throw new UnauthorizedError(loginError);
  }
  // извлечём токен
  const token = req.headers.authorization.replace('Bearer ', '');
  // верифицируем токен
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    console.log('2')
    throw new UnauthorizedError(loginError);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next();
};

module.exports = { auth };
