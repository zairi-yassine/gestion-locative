const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK using either a service account JSON string
// in env var `FIREBASE_SERVICE_ACCOUNT` or a path in `FIREBASE_SERVICE_ACCOUNT_PATH`.
function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;

  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
      console.error('FIREBASE_SERVICE_ACCOUNT is not valid JSON');
      throw err;
    }
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const path = require('path');
    const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const resolved = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Service account file not found at ${resolved}`);
    }
    serviceAccount = require(resolved);
  } else {
    console.warn('No Firebase service account provided. Firebase Admin not initialized.');
    return admin;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('Firebase Admin initialized for project:', serviceAccount.project_id);
  return admin;
}

module.exports = initFirebase();
