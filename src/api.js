import { firestore } from './firebase'
import { getDocumentData } from './util'

export const addPost = post => {
  firestore.collection('posts').add(post).catch(console.error)
}

export const getRef = path => {
  return firestore.doc(path)
}

export const postsListener = callback => {
  return firestore
    .collection('posts')
    .onSnapshot(snapshot => {
      const posts = snapshot.docs.map(getDocumentData)
      callback(posts)
    })
}