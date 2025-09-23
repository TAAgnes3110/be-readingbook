const admin = require('firebase-admin')
// Client SDK imports - Ẩn tạm thời
// const { initializeApp } = require('firebase/app')
// const { getAuth } = require('firebase/auth')
// const { getDatabase } = require('firebase/database')
const config = require('./config')
const serviceAccount = require('../../serviceAccountKey.json')

// Initialize Firebase Admin SDK (Server-side)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebase.databaseURL,
  storageBucket: config.firebase.storageBucket
})

// Firebase Client SDK - Ẩn tạm thời cho logic backend
// const firebaseConfig = {
//   apiKey: config.firebase.apiKey,
//   authDomain: config.firebase.authDomain,
//   projectId: config.firebase.projectId,
//   storageBucket: config.firebase.storageBucket,
//   messagingSenderId: config.firebase.messagingSenderId,
//   appId: config.firebase.appId,
//   databaseURL: config.firebase.databaseURL
// }

// const firebaseApp = initializeApp(firebaseConfig)
// const auth = getAuth(firebaseApp)
// const clientDb = getDatabase(firebaseApp)

// Server-side instances
const db = admin.database()
const storage = admin.storage()

module.exports = {
  // Admin SDK (Server-side)
  admin,
  db,
  storage,
  getRef: (path) => db.ref(path),
  getBucket: () => storage.bucket(),

  // Client SDK
  // firebaseApp,
  // auth,
  // clientDb,

  // Utility functions
  verifyIdToken: (idToken) => admin.auth().verifyIdToken(idToken),
  createCustomToken: (uid, additionalClaims) => admin.auth().createCustomToken(uid, additionalClaims),
  getUser: (uid) => admin.auth().getUser(uid),
  createUser: (userRecord) => admin.auth().createUser(userRecord),
  updateUser: (uid, userRecord) => admin.auth().updateUser(uid, userRecord),
  deleteUser: (uid) => admin.auth().deleteUser(uid)
}
