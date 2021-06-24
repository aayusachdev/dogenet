const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors')({ origin: true });

app.use(cors); // using cors middleware

const { db } = require('./utils/admin');
const FbAuth = require('./utils/FBAuth');
const { signup, login, addUserProfileDetails, getAuthenticatedUserDetails, uploadImage, getUserDetails } = require('./controllers/users');
const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream } = require('./controllers/screams');

app.get('/screams', getAllScreams); // Route to fetch all the screams
app.post('/scream', FbAuth, postOneScream); // Route to add a new scream
app.get('/scream/:screamId', getScream); // Route to get all details of a scream
app.post('/scream/:screamId', FbAuth, commentOnScream); // Route to add comment on a scream
app.get('/scream/:screamId/like',FbAuth, likeScream); // Route to like a scream
app.get('/scream/:screamId/unlike',FbAuth, unlikeScream); // Route to like a scream
app.delete('/scream/:screamId', FbAuth, deleteScream); // Route to delete a scream

app.post('/signup', signup); // Route to signup a New user.
app.post('/login', login);  // Route for user login
app.post('/user', FbAuth, addUserProfileDetails); // Route to add profile details of a signed in user
app.get('/user', FbAuth, getAuthenticatedUserDetails); // Route to get the profile data of signed in user
app.post('/user/uploadimage', FbAuth, uploadImage); // Route to upload profile pic
app.get('/user/:handle', getUserDetails); // Route to get any user details

exports.api = functions.https.onRequest(app);

/*---------------Notifications code ------------------------*/
// Notifications -> Firebase triggers like on authentication
// firestore, realtime DB etc
// We will use Firestore trigger.
/*----------------------------------------------------------*/

// Need to deploy to firebase to test these triggers

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if (doc.exists && doc.data.userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            "recipient": doc.data().userHandle,
            "sender": snapshot.data().userHandle,
            "type": "like",
            "read": false,
            "createdAt": new Date().toISOString(),
            "screamId": doc.id
          })
        }
      }).catch((err) => {
        console.error(err);
        return;
      })
});

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
.onDelete((snapshot) => {
  db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc => {
      if (doc.exists) {
        return db.doc(`/notifications/${snapshot.id}`).delete()
      }
    }).catch((err) => {
      console.error(err);
      return;
    })
});

exports.createNotificationOnComment= functions.firestore.document('comments/{id}')
.onCreate((snapshot) => {
  db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc => {
      if (doc.exists && doc.data.userHandle !== snapshot.data().userHandle) {
        return db.doc(`/notifications/${snapshot.id}`).set({
          "recipient": doc.data().userHandle,
          "sender": snapshot.data().userHandle,
          "type": "comment",
          "read": false,
          "createdAt": new Date().toISOString(),
          "screamId": doc.id
        })
      }
    }).catch((err) => {
      console.error(err);
      return;
    })
});

exports.onUserImageChange = functions.firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    // only trigger this if the new profile url is different from the old one.
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {

      let batch = db.batch();
      return db.collection('/screams').where('userhandle', '==', change.before.data().handle).get()
        .then((data) => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          })
          return batch.commit();
        })
    }
    return;
  });

// https://baseurl.com/screams
// https://baseurl.com/api/screams -> Better architecture
/* ---------------------------------------------------------------------------------*/
/* Another way(without using express): Writing individual methods for each function */
/* -------------------------------------------------------------------------------- */

// exports.getScreams = functions.https.onRequest((request, response) => {
//   admin.firestore().collection('screams').get()
//     .then(data => {
//       let screams = [];
//       data.forEach(doc => {
//         screams.push(doc.data());
//       });
//       return response.json(screams);
//     })
//     .catch(err => console.log(err));
// })

