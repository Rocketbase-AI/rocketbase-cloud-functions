import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import cookie from "js-cookie";
import Router from "next/router";


const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
};

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    /* Helper */

    this.fieldValue = firebase.firestore.FieldValue;
    this.emailAuthProvider = firebase.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = firebase.auth();
    this.db = firebase.firestore();

    /* Social Sign In Method Provider */

    this.googleProvider = new firebase.auth.GoogleAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) => {
    Router.push("/home");
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignOut = () => {
    cookie.remove("token");
    // to support logging out from all windows
    window.localStorage.setItem("logout", Date.now());
    Router.push("/");
    return this.auth.signOut();
  }

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(snapshot => {
            const dbUser = snapshot.data();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            // merge auth and db user
            authUser = {
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              uid: authUser.uid,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.db.doc(`users/${uid}`);

  users = () => this.db.collection("users");
}

export default Firebase;
