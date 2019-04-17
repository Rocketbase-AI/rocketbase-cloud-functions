import * as path from "path";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as next from "next";
import * as cors from "cors";
import * as mixpanel from "mixpanel";
import {
  DEFAULT_REGION,
  MODELS_COLLECTION_NAME,
  MODELS_SELECTION_EVENT,
  MODEL_SAVE_EVENT,
  PYTORCH_FRAMEWORK,
  GET_CREDENTIALS_EVENT,
} from "./constants";
import credentials from "./credentials";

// Initializes Cloud Functions.
admin.initializeApp();

// Firestore settings.
const db = admin.firestore();

// Initiate Mixpanel client
const Mixpanel = mixpanel.init("793aeec70db39b86d15260f129ec4680");

// CORS configuration.
const corsHandler = cors({ origin: true });

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` },
});
const handle = app.getRequestHandler();

export const nextApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});

export const getAvailableModels = functions
  .region(DEFAULT_REGION)
  .https.onRequest(async (req, res) => {
    corsHandler(req, res, () => {
      // allow cross-domain calls from any origin
    });
    if (req.method !== "GET") {
      return res.status(405).send(`${req.method} method not allowed.`);
    }
    const { author, model, version } = req.query;

    if (!model || !author) {
      return res.status(400).send("Required request parameters missing.");
    }
    Mixpanel.track(MODELS_SELECTION_EVENT, { author, model, version });
    let modelSnapShot;
    try {
      modelSnapShot = await db
        .collection(MODELS_COLLECTION_NAME)
        .where("author", "==", author)
        .where("slug", "==", model)
        .get();
    } catch (e) {
      return res.status(500).send(`Internal database error.`);
    }
    const allModels: any[] = modelSnapShot.docs.map(doc => doc.data());
    return res.status(200).json(allModels);
  });

export const getUploadCredentials = functions
  .region(DEFAULT_REGION)
  .https.onRequest(async (req, res) => {
    corsHandler(req, res, () => {
      // allow cross-domain calls from any origin
    });
    if (req.method !== "GET") {
      return res.status(405).send(`${req.method} method not allowed.`);
    }
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Required request parameters missing.");
    }
    Mixpanel.track(GET_CREDENTIALS_EVENT, { token });
    return res.status(200).json(credentials);
  });

export const saveNewModel = functions
  .region(DEFAULT_REGION)
  .https.onRequest(async (req, res) => {
    corsHandler(req, res, () => {
      // allow cross-domain calls from any origin
    });
    if (req.method !== "POST") {
      return res.status(405).send(`${req.method} method not allowed.`);
    }
    const {
      author,
      model,
      version,
      folderName,
      modelFilePath,
      isPrivate,
    } = req.body;

    if (
      !model ||
      !author ||
      !version ||
      !folderName ||
      !modelFilePath ||
      typeof isPrivate === "undefined"
    ) {
      return res.status(400).send("Required request parameters missing.");
    }
    Mixpanel.track(MODEL_SAVE_EVENT, { author, model, version, isPrivate });
    const newModel = {
      author,
      folderName,
      framework: PYTORCH_FRAMEWORK,
      model,
      modelFilePath,
      private: isPrivate,
      version,
      publicationDate: admin.firestore.Timestamp.fromDate(new Date()),
      name: folderName,
    };
    let modelRef;
    try {
      modelRef = await db.collection(MODELS_COLLECTION_NAME).add(newModel);
    } catch (e) {
      return res.status(500).send(`Internal database error.`);
    }
    return res.status(201).json({ id: modelRef.id });
  });
