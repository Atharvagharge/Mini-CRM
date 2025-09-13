const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ensureJwt = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({error: 'No token'});

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.id);
    if (!user) return res.status(401).json({error: 'User not found'});
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token', detail: err.message });
  }
};

module.exports = { ensureJwt };
