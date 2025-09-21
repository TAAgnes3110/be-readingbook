const admin = require('firebase-admin')
const config = require('./config')
const serviceAccount = require('../../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebase.databaseURL,
  storageBucket: config.firebase.storageBucket
})

const db = admin.database()
const storage = admin.storage()

module.exports = {
  admin,
  db,
  storage,
  getRef: (path) => db.ref(path),
  getBucket: () => storage.bucket()
}
