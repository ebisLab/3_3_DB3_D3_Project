const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const Users = require('../users/users-model.js');
const secrets = require('../config/secrets');

// for endpoints beginning with /api/auth
// router.post('/register', (req, res) => {
//   let { username, password, department } = req.body;

//   if (!username && !password && !department) {
//     res.status(401).json({ message: 'Sorry, no info' })
//   } else {
//     const hash = bcrypt.hashSync(req.body.password, 10); // 2 ^ n
//     req.body.password = hash;

//     const token = generateToken(req.body)
//     Users.add(req.body)
//       .then(saved => {
//         res.status(201).json({ token });
//       })
//       .catch(error => {
//         res.status(500).json(error);
//       });

//   }

// });

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //need a way to get that token
        const token = generateToken(user);
        res.status(200).json({ token });
      } else if (req.headers.authorization === token) {
        res.status(401).json({ message: 'User is logged in already' });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    username: user.username,
  }

  const options = {
    //expiration of the token
    expiresIn: '1d', //one day
  }
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
