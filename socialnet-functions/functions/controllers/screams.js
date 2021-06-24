const { db } = require('../utils/admin');

/**
 * Controller to get all the screams from the DB
 *
 * @param {*} request
 * @param {*} response
 */
exports.getAllScreams = (request, response) => {
  db.collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...doc.data()
        });
      });
      return response.json(screams);
    })
    .catch(err => console.log(err));
};


/**
 * Controller to post one scream by an authorized user
 * Authorization done by @FBAuth middleware
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
exports.postOneScream = (request, response) => {
  if (request.body.body.trim() === '')
    return response.status(400).json({ body: 'Body must not be empty' });
  const newScream = {
    body: request.body.body,
    userHandle: request.user.handle, // coming from FBAuth
    userImage: request.user.imageURL,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };
  db.collection('screams')
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      return response.json(resScream);
    })
    .catch(err => {
      response.status(500).json({ error: 'something went wrong' });
      console.log(err);
    })
};


/**
 * Controller to get all the details of a scream
 *
 * @param {*} request
 * @param {*} response
 */
exports.getScream = (request, response) => {
  let screamData = {};
  db.doc(`/screams/${request.params.screamId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "scream not found" })
      }
      screamData = doc.data();
      screamData.screamId = doc.id;

      return db.collection('comments')
        .where('screamId', '==', request.params.screamId)
        .orderBy('createdAt', 'desc')
        .get()
    }).then(data => {
      screamData.comments = [];
      data.forEach(doc => {
        screamData.comments.push(doc.data());
      })
      return response.json(screamData);
    }).catch(err => {
      console.log(err);
      response.status(500).json({ error: err.code })
    })
};

/**
 * Controller to add a new comment to a scream
 *
 * @param {*} request
 * @param {*} response
 */
exports.commentOnScream = (request, response) => {
  if (request.body.body.trim() === '')
    return response.status(400).json({ body: 'Body must not be empty' });
  let newComment = {
    screamId: request.params.screamId,
    userHandle: request.user.handle, // coming from FBAuth
    userImage: request.user.imageURL,
    createdAt: new Date().toISOString(),
    body: request.body.body
  };
  db.doc(`/screams/${request.params.screamId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: 'Scream not found' });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    }).then(() => {
      return db.collection('comments').add(newComment);
    }).then(() => {
      return response.status(200).json(newComment);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: 'something went wrong' });
    })
};

/**
 * Controller to like a scream
 *
 * @param {*} request
 * @param {*} response
 */
exports.likeScream = (request, response) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', request.user.handle)
    .where('screamId', '==', request.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${request.params.screamId}`);
  // check whether this scream exists or not
  let screamData;
  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return response.status(404).json({ error: 'Scream not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            screamId: request.params.screamId,
            userHandle: request.user.handle
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            response.json(screamData);
          });
      } else {
        return response.status(400).json({ error: 'Scream already liked' });
      }
    }).catch(err => {
      console.error(err);
      response.json({ error: err.code })
    })
};

/**
 * Controller to unlike a scream
 *
 * @param {*} request
 * @param {*} response
 */
exports.unlikeScream = (request, response) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', request.user.handle)
    .where('screamId', '==', request.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${request.params.screamId}`);
  // check whether this scream exists or not
  let screamData;
  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return response.status(404).json({ error: 'Scream not found' });
      }
    }).then((data) => {
      if (data.empty) {
        return response.status(400).json({ error: 'Scream not liked' });
      } else {
        return db
          .doc(`likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          }).then(() => {
            response.json(screamData);
          })
      }
    }).catch(err => {
      console.error(err);
      response.json({ error: err.code })
    })
}

/**
 * Controller to delete a scream
 *
 * @param {*} request
 * @param {*} response
 */
exports.deleteScream = (request, response) => {
  const document = db.doc(`/screams/${request.params.screamId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: 'Scream not found' })
      }
      if (doc.data().userHandle !== request.user.handle) {
        return response.status(404).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    }).then(() => {
      response.json({ message: 'Scream deleted successfully' })
    }).catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    })
}