import * as cors from "cors";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as mixpanel from "mixpanel";
import {
  DEFAULT_REGION,
  GET_CREDENTIALS_EVENT,
  MODEL_SAVE_EVENT,
  MODELS_COLLECTION_NAME,
  MODELS_SELECTION_EVENT,
  ROCKET_NAME_FIELD,
  USERNAME_FIELD,
} from "./constants";
import credentials from "./credentials";
import { rocketbase } from "./rocketbase";

// Initializes Cloud Functions.
admin.initializeApp();

// Firestore settings.
const db = admin.firestore();

// Initiate Mixpanel client
const Mixpanel = mixpanel.init("793aeec70db39b86d15260f129ec4680");

// CORS configuration.
const corsHandler = cors({ origin: true });

// const dev = process.env.NODE_ENV !== "production";

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
      token,
    }: {
      username: string;
      modelName: string;
      label: string;
      token: string;
    } = req.query;

    if (!token) {
      return res.status(401).send("Authentication token missing.");
    }
    if (!modelName || !username) {
      return res.status(400).send("Required request parameters missing.");
    }
    Mixpanel.track(MODELS_SELECTION_EVENT, {
      label,
      modelName,
      token,
      username,
    });
    let querySnapShot: admin.firestore.QuerySnapshot;
    // TODO: check whether authorised user actually has permission to access model
    try {
      querySnapShot = await db
        .collection(MODELS_COLLECTION_NAME)
        .where(USERNAME_FIELD, "==", username)
        .where(ROCKET_NAME_FIELD, "==", modelName)
        .get();
    } catch (e) {
      console.log(e);
      return res.status(500).send(`Internal database error.`);
    }
    let rockets = querySnapShot.docs.map(doc => doc.data());
    if (label) {
      rockets = rockets.filter(rocket => rocket.label === label);
    }
    // return early if no filtering needed
    if (rockets.length <= 1) {
      return res.status(200).json(rockets);
    }
    const filteredModels: any[] = rockets.filter(
      modelDoc => modelDoc.isDefaultVersion,
    );
    // Check whether any model was selected as default
    if (!filteredModels.length) {
      // Reduce models to one with latest launchdate
      const reducedModels = rockets.reduce((prev, curr) =>
        prev.launchDate.seconds > curr.launchDate.seconds ? prev : curr,
      );
      rockets = [reducedModels];
    } else {
      rockets = filteredModels;
    }
    return res.status(200).json(rockets);
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
      return res.status(401).send("Authentication token missing.");
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
      family,
      modelName,
      username,
    });
    // TODO: add parent and user ref later on
    const newModel: rocketbase.Rocket = {
      apiUrl: "",
      description,
      downloadUrl,
      family,
      hash,
      isDefaultVersion: false,
      isPrivate: false,
      isTrainable,
      label: hash,
      launchDate: admin.firestore.Timestamp.fromDate(new Date()),
      modelName,
      originRepoUrl,
      paperUrl,
      parentRef: null,
      rocketRepoUrl,
      trainingDataset,
      userRef: null,
      username,
    };
    let rocketRef: admin.firestore.DocumentReference;
    try {
      rocketRef = await db.collection(MODELS_COLLECTION_NAME).add(newModel);
    } catch (e) {
      console.log(e);
      return res.status(500).send(`Internal database error.`);
    }
    return res.status(201).json({ id: rocketRef.id });
  });
