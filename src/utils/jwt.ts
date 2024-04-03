import jwt from 'jsonwebtoken';
// import Jwt from 'jsonwebtoken';

function generateToken(payload: {}) {
  return jwt.sign(payload, 'dev_secret', { expiresIn: 3600 });
}

export default generateToken;
