const { db, admin } = require('../utils/admin');
const firebase = require('firebase');
const config = require('../utils/config');
const { isValid, isEmpty, reduceUserDetails } = require('../utils/validators');

firebase.initializeApp(config);

/**
 * Controller to Signup a new user
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle,
  };

  let errors = {};
  if (isEmpty(newUser.email)) {
    errors.email = 'Must not be empty'
  } else if (!isValid(newUser.email)) {
    errors.email = 'Must be a valid email'
  }

  if (isEmpty(newUser.password)) errors.password = 'Must not be empty'
  if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match'
  if (isEmpty(newUser.handle)) errors.handle = 'Must not be empty'

  if (Object.keys(errors).length > 0) {
    return response.status(400).json(errors);
  }

  let token, userId;
  db.doc(`users/${newUser.handle}`).get()
    .then(doc => {
      if (doc.exists) {
        return response.status(400).json({ handle: 'this handle is already taken.' })
      } else {
        return firebase.auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    }).then(data => {
      console.log(">>>>", data);
      userId = data.user.uid;
      return data.user.getIdToken();
    }).then(tokenId => {
      token = tokenId;
      const noImg = 'noimg.png';
      const userCredentials = {
        createdAt: new Date().toISOString(),
        ...newUser,
        imageURL: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    }).then(() => {
      return response.status(201).json({ token });
    })
    .catch(err => {
      console.log(err);
      if (err.code === 'auth/email-already-in-use') {
        return response.status(400).json({ email: 'Email is already in use' })
      } else {
        return response.status(500).json({ error: err.code });
      }
    })
};

/**
 * Controller to login an already signedup user
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
exports.login = (request, response) => {

  const userData = {
    email: request.body.email,
    password: request.body.password
  };

  let errors = {};
  if (isEmpty(userData.email)) errors.email = 'Must not be empty';
  if (isEmpty(userData.password)) errors.password = 'Must not be empty';

  if (Object.keys(errors).length > 0) return response.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
    .then(data => {
      console.log("LOGIN>>", data);
      return data.user.getIdToken()
    }).then(token => {
      return response.json({ token });
    }).catch(err => {
      console.log(err);
      //auth/wrong-password
      //auth/user-not-registered
      console.log("GENERAL ERROR", err.code);
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code==="auth/invalid-email") {
        return response.status(403).json({ general: 'wrong credentails, please try again' })
      }
      return response.status(500).json({ error: err.code });
    })
};

/**
 * Controller to add profile information for the signed in user
 *
 * @param {*} request
 * @param {*} response
 */
exports.addUserProfileDetails = (request, response) => {
  console.log("AAAAAAAAAAAAAAAAaa", request.body);
  let userDetails = reduceUserDetails(request.body);
  console.log("SSSSSSS", userDetails);
  db.doc(`/users/${request.user.handle}`).update(userDetails)
    .then(() => {
      return response.status(200).json({ message: 'Details added successfully' });
    }).catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code })
    })
};

/**
 * Controller to get all the profile credentails of the signed in user.
 * SEE- Once a user signs in on frontend we don't send all the details at once.
 * We send at auth token. Once he goes to the profile dashboard then we redirect to the
 * route to GET all the user credentials.
 * These details are then stored in redux store on frontend.
 *
 * @param {*} request
 * @param {*} response
 */
exports.getAuthenticatedUserDetails = (request, response) => {
  let userData = {};
  db.doc(`/users/${request.user.handle}`).get()
    .then(doc => {
      if (doc.exists) {
        userData.credentails = doc.data();
        // console.log("userData.credentail", userData.credentails);
        return db.collection('likes').where('userHandle', '==', request.user.handle).get()
    }
    }).then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return response.json(userData);
    }).catch(err => {
      console.error(err);
      return response.status(500).json({error: err.code})
  })
}

/**
 * Controller to upload profile pic for signed in user
 *
 * @param {*} req
 * @param {*} res
 */
exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy')
  const path = require('path')
  const os = require('os')
  const fs = require('fs')

  const busboy = new BusBoy({ headers: req.headers })

  let imageFileName;
  let imageToBeUploaded = {}

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' })
    }
    const imageExtension = filename.split('.')[filename.split('.').length - 1]
    imageFileName = `${Math.round(
      Math.random() * 10000000000000000
    )}.${imageExtension}`

    const filepath = path.join(os.tmpdir(), imageFileName)
    imageToBeUploaded = { filepath, mimetype }
    file.pipe(fs.createWriteStream(filepath))
  })
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageURL = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        console.log(imageURL);
        return db.doc(`/users/${req.user.handle}`).update({ imageURL })
      })
      .then(() => {
        return res.json({ message: 'Image uploaded successfully' })
      })
      .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err.code })
      })
  })
  busboy.end(req.rawBody)
};

/**
 * Controller to get any user's details
 *
 * @param {*} req
 * @param {*} res
 */
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("screams")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({ errror: "User not found" });
      }
    })
    .then((data) => {
      userData.screams = [];
      data.forEach((doc) => {
        userData.screams.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          screamId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};