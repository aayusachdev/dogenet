import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCMMD8xBIouA3vXiUPzlTdU1PtNgdtYMs8",
  authDomain: "ecom-db-1d77c.firebaseapp.com",
  databaseURL: "https://ecom-db-1d77c.firebaseio.com",
  projectId: "ecom-db-1d77c",
  storageBucket: "ecom-db-1d77c.appspot.com",
  messagingSenderId: "995605403940",
  appId: "1:995605403940:web:0a5639a6b1938886ccbbb1",
  measurementId: "G-FNW7VXVV9V"
});

firebase.firestore().settings({ experimentalForceLongPolling: true });

const db = firebaseApp.firestore();

export { db };