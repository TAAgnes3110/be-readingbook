const admin = require('firebase-admin')
const config = require('./config')
const serviceAccount = require('../../serviceAccountKey.json')

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
  deleteUser: (uid) => auth.deleteUser(uid)
}
