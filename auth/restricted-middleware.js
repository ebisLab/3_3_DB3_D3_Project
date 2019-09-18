const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const { username, password } = req.headers;

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        //token expired or is invalide
        res.status(401).json({ message: 'You shall not pass!' })
      } else {
        //token is good
        next();
      }
    });
  }
};
