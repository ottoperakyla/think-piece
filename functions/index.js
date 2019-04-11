const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()
const firestore = admin.firestore()

exports.getAllPosts = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await firestore.collection('posts').get()
    const posts = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))

    response.json({ posts })
  } catch (error) {
    response.json({ error })
  }
})

exports.sanitizeContent = functions.firestore
  .document('posts/{postId}')
  .onWrite(async change => {
    // dont do anything if its delete
    if (!change.after.exists) {
      return
    }

    const { content, sanitized } = change.after.data()

    if (content && !sanitized) {
      return change.after.ref.update({
        content: content.replace(/CoffeeScript/g, '*****'),
        sanitized: true
      })
    }

    return null
  })

exports.incrementCommentCount = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onCreate(async (snapshot, context) => {
    const { postId } = context.params
    const postRef = firestore.doc(`posts/${postId}`)

    const snap = await postRef.get()
    const comments = snap.get('comments')

    return postRef.update({ comments: comments + 1 })
  })
  