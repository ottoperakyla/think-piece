import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: "AIzaSyCiixmUSSWD4c-cTFWVVXWKOULlTrI0EuU",
  authDomain: "stink-piece.firebaseapp.com",
  databaseURL: "https://stink-piece.firebaseio.com",
  projectId: "stink-piece",
  storageBucket: "stink-piece.appspot.com",
  messagingSenderId: "196496224027"
};

firebase.initializeApp(config)

window.firebase = firebase

export default firebase
export const firestore = firebase.firestore()
export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () => auth.signInWithPopup(provider)
export const signOut = () => auth.signOut()
firestore.settings({ timestampsInSnapshots: true })

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return null

  const userRef = firestore.doc(`users/${user.uid}`)
  const snapshot = await userRef.get()

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user
    const createdAt = new Date()
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      })
    } catch (err) {
      console.error('Error creating user', err)
    }
  }

  return getUserProfileDocument(user.uid)
}

export const getUserProfileDocument = async (uid) => {
  if (!uid) return null

  try {
    const userDocument = await firestore.doc(`users/${uid}`).get()
    return { uid, ...userDocument.data() }
  } catch(err) {
    console.log('Error fetching user', err)
  }
}
