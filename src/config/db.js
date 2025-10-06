const admin = require('firebase-admin')
const config = require('./config')

// Create service account object from environment variables
const serviceAccount = {
  type: 'service_account',
  project_id: config.firebase.projectId,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebase.databaseURL
  })
}

const db = admin.database()
const auth = admin.auth()

module.exports = {
  admin,
  db,
  auth,

  getRef: (path) => db.ref(path),

  createUser: (userRecord) => auth.createUser(userRecord),
  getUser: (uid) => auth.getUser(uid),
  deleteUser: (uid) => auth.deleteUser(uid),
  getUserByEmail: (email) => auth.getUserByEmail(email)
}
