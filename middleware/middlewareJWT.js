const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const secretKey = crypto.randomBytes(32).toString('base64');



const generateToken = (user) => {
  const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
  return token;
};


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token not valid' });
    } else {
      req.user = decoded;
      next();
    }
  });
};


module.exports = {
    generateToken,
    verifyToken
};