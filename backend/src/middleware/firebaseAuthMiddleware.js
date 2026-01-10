const admin = require('../firebaseAdmin');

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    if (!admin || !admin.auth) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({ message: 'Server auth configuration error' });
    }
    // Debug: log that we received a token (do not log full token)
    console.log('Auth header length:', authHeader.length);
    const decoded = await admin.auth().verifyIdToken(idToken);
    // Debug: log decoded uid
    console.log('Firebase token verified for uid:', decoded.uid);
    // Attach firebase info to request
    req.user = { uid: decoded.uid, email: decoded.email, firebase: decoded };
    next();
  } catch (err) {
    console.error('Firebase token verification failed:', err && err.code ? err.code : err.message || err);
    return res.status(401).json({ message: 'Token Firebase invalide ou expiré.' });
  }
};
