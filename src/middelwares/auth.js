const jwt = require('jsonwebtoken');
const User = require('../model/schema/user');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication failed. Token missing or invalid format.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.active) {
      return res
        .status(401)
        .json({ message: 'User no longer exists or is inactive' });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.log(`CHECKING . . . . . . err: `, err);
    return res
      .status(403)
      .json({ message: 'Authentication failed. Invalid token.' });
  }
};

module.exports = auth;
