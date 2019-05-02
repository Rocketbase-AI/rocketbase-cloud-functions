import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import cookie from "js-cookie";
import Router from "next/router";
import * as ROUTES from "../../constants/routes";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
};

class Firebase {
  auth: any;
  db: any;
  storage: any;
  googleProvider: any;
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    /* Firebase APIs */

    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.storage = firebase.storage();

    /* Social Sign In Method Provider */

    this.googleProvider = new firebase.auth.GoogleAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email: string, password: string) => {
    Router.push("/home");
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignOut = () => {
    cookie.remove("token");
    // to support logging out from all windows
    window.localStorage.setItem("logout", Date.now().toString());
    Router.push(ROUTES.LANDING);
    return this.auth.signOut();
  };

  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  doPasswordUpdate = (password: string) =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next: any, fallback: any) =>
    this.auth.onAuthStateChanged((authUser: any) => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then((snapshot: any) => {
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

  user = (uid: number) => this.db.collection("users").doc(uid);

  users = () => this.db.collection("users");

  // *** Models API ***

  model = async (uid: number) => this.db.collection("models").doc(uid).get();

  models = async () => {
    const snapshot: firebase.firestore.QuerySnapshot = await this.db
      .collection("models")
      .where("private", "==", false)
      .get();
    // const fetchModels = async () => {
    //   const models: any[] = [];
    //   await Promise.all(
    //     snapshot.docs.map(async (doc: any) => {
    //       if (doc.exists) {
    //         const modelData = doc.data();
    //         const modelStorageRef = this.storage.ref(modelData.modelFilePath);
    //         const modelDownloadUrl = await modelStorageRef.toString();
    //         modelData.modelDownloadUrl = modelDownloadUrl;
    //         models.push(modelData);
    //       }
    //     }),
    //   );
    //   return models;
    // };
    // const fetchedModels = fetchModels();
    const fetchedModels = snapshot.docs.map(
      (doc: firebase.firestore.QueryDocumentSnapshot) => {
        const fetchedModel = doc.data();
        fetchedModel.id = doc.id;
        return fetchedModel;
      },
    );
    return fetchedModels;
  };

  // *** Helper functions ***

  getDownloadURL = async (fileRef: string) => {
    const fileStorageRef = this.storage.ref(fileRef);
    const publicDownloadUrl = await fileStorageRef.getDownloadURL();
    return publicDownloadUrl;
  };
}

export default Firebase;
