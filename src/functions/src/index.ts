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
  GET_CREDENTIALS_EVENT,
  USERNAME_FIELD,
  ROCKET_NAME_FIELD,
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

/* --------------- Serving the next application --------------- */

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` },
});
const handle = app.getRequestHandler();

export const nextApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});

/* --------------- Independent cloud functions --------------- */

// Query available models for landing a rocket

export const getAvailableModels = functions
  .region(DEFAULT_REGION)
  .https.onRequest(async (req, res) => {
    corsHandler(req, res, () => {
      // allow cross-domain calls from any origin
    });
    if (req.method !== "GET") {
      return res.status(405).send(`${req.method} method not allowed.`);
    }
    // TODO: check whether user is authenticated
    const {
      username,
      modelName,
      label,
    }: { username: string; modelName: string; label: string } = req.query;

    if (!modelName || !username) {
      return res.status(400).send("Required request parameters missing.");
    }
    Mixpanel.track(MODELS_SELECTION_EVENT, { username, modelName, label });
    let querySnapShot;
    // TODO: check whether authorised user actually has permission to access model
    try {
      querySnapShot = await db
        .collection(MODELS_COLLECTION_NAME)
        .where(USERNAME_FIELD, "==", username)
        .where(ROCKET_NAME_FIELD, "==", modelName)
        .get();
    } catch (e) {
      return res.status(500).send(`Internal database error.`);
    }
    let allModels: any[] = querySnapShot.docs.map(doc => doc.data());
    if (label) {
      allModels = allModels.filter((modelDoc: any) => modelDoc.label === label);
    } else {
      allModels = allModels.filter(
        (modelDoc: any) => modelDoc.isDefaultVersion,
      );
    }
    return res.status(200).json(allModels);
  });

// Get credentials in order to upload new rockets to Cloud Storage

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
      return res.status(400).send("Authentication token missing.");
    }
    Mixpanel.track(GET_CREDENTIALS_EVENT, { token });
    return res.status(200).json(credentials);
  });

// Save new models into the database from the pip package

export const saveNewModel = functions
  .region(DEFAULT_REGION)
  .https.onRequest(async (req, res) => {
    corsHandler(req, res, () => {
      // allow cross-domain calls from any origin
    });
    if (req.method !== "POST") {
      return res.status(405).send(`${req.method} method not allowed.`);
    }
    // TODO: check whether user is authenticated
    const {
      modelName,
      username,
      family,
      trainingDataset,
      isTrainable,
      rocketRepoUrl,
      paperUrl,
      originRepoUrl,
      description,
      downloadUrl,
      hash,
    }: {
      modelName: string;
      username: string;
      family: string;
      trainingDataset: string;
      isTrainable: boolean;
      rocketRepoUrl: string;
      paperUrl: string;
      originRepoUrl: string;
      description: string;
      downloadUrl: string;
      hash: string;
    } = req.body;

    if (
      !modelName ||
      !username ||
      !family ||
      !trainingDataset ||
      typeof isTrainable === "undefined" ||
      !rocketRepoUrl ||
      !paperUrl ||
      !originRepoUrl ||
      !description ||
      !downloadUrl ||
      !hash
    ) {
      return res.status(400).send("Required request parameters missing.");
    }
    Mixpanel.track(MODEL_SAVE_EVENT, {
      username,
      modelName,
      family,
    });
    const newModel = {
      parentRef: "",
      userRef: "",
      modelName,
      username,
      family,
      hash,
      launchDate: admin.firestore.Timestamp.fromDate(new Date()),
      trainingDataset,
      isTrainable,
      isPrivate: false,
      apiUrl: "",
      rocketRepoUrl,
      paperUrl,
      originRepoUrl,
      downloadUrl,
      description,
      label: hash,
      isDefaultVersion: false,
    };
    let rocketRef;
    try {
      rocketRef = await db.collection(MODELS_COLLECTION_NAME).add(newModel);
    } catch (e) {
      return res.status(500).send(`Internal database error.`);
    }
    return res.status(201).json({ id: rocketRef.id });
  });
