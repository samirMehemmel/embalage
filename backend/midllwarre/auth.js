import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'dev-secret';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.admin = decoded; // tu peux utiliser req.admin dans les routes ensuite
    next();
  } catch (err) {
    console.error('❌ Token invalide:', err.message);
    res.status(401).json({ error: 'Token expiré ou invalide' });
  }
};
