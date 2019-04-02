import * as path from "path";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as next from "next";
import {} from "./constants";

// Initializes Cloud Functions.
admin.initializeApp(functions.config().firebase);

// Firestore settings.
// const db = admin.firestore();

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` },
});
const handle = app.getRequestHandler();

export const nextApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});

// exports.createInitialUserProfile = functions
//   .region(DEFAULT_REGION)
//   .auth.user()
//   .onCreate(async user => {
//     const initialUserData = {
//       created_at: new Date(),
//       last_login: new Date(),
//       admin: false,
//     };
//     try {
//       const writeResult = await db
//         .collection(USERS_COLLECTION_NAME)
//         .doc(user.uid)
//         .set(initialUserData);
//       return writeResult.writeTime.toDate();
//     } catch (error) {
//       return error;
//     }
//   });
