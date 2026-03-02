const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'mock-secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ code: 'AUTH_002', message: 'No token provided' });

  try {
    const token = authHeader.replace('Bearer ', '');
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ code: 'AUTH_002', message: 'Invalid token' });
  }
};
