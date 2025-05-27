const jwt = require('jsonwebtoken');

const createToken = (managerId) => {
  return jwt.sign({ id: managerId }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createToken, verifyToken };