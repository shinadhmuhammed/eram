const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token =
    req.cookies.super_admin ||
    req.cookies.admin ||
    req.cookies.recruiter ||
    req.cookies.candidate ||
    req.cookies.employee;

    // console.log(token)
    
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;
