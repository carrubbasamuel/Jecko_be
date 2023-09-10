const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const secretKey = crypto.randomBytes(32).toString('base64');



const generateToken = (user) => {
  const token = jwt.sign(user, secretKey, { expiresIn: '5h' });
  return encodeURI(token);
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

const getIdByTokenForSocket = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded._id);
      }
    });
  });
};



module.exports = {
  generateToken,
  verifyToken,
  getIdByTokenForSocket,
};