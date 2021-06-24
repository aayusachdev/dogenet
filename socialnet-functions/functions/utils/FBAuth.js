const { admin, db } = require('./admin');

/**
 * Firebase Authorization middleware.
 * Checks the header for the authorization key. Verifies it to check whether it is from
 * same source, if verified a decodedToken promise is returned which contains the user
 * to whom this auth key belongs. Using the uid from decodedToken. userHandle is retrieved
 * from the db and added to the request object and called next()
 *
 * @param {*} request user request to some protected endpoint
 * @param {*} response
 * @param {*} next
 * @returns
 */
module.exports = (request, response, next) => {
  let idToken;
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
    idToken = request.headers.authorization.split('Bearer ')[1];
  } else {
    console.error("No token found")
    return response.status(403).json({error: 'Unauthorized'})
  }

  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      console.log(">>>decodedToken>>>", decodedToken);
      request.user = decodedToken;
      return db.collection('users')
        .where('userId', '==', request.user.uid)
        .limit(1)
        .get();
    }).then(data => {
      request.user.handle = data.docs[0].data().handle;
      request.user.imageURL = data.docs[0].data().imageURL;
      return next();
    }).catch(err => {
      console.error("Error while verifying token");
      return response.status(403).json(err);
  })
};
