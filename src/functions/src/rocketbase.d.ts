import * as admin from "firebase-admin";

declare namespace rocketbase {
  export interface Rocket {
    parentRef: admin.firestore.DocumentReference | undefined;
    userRef: admin.firestore.DocumentReference | undefined;
    modelName: string;
    username: string;
    family: string;
    hash: string;
    launchDate: admin.firestore.Timestamp;
    trainingDataset: string;
    isTrainable: boolean;
    isPrivate: boolean;
    apiUrl: string;
    rocketRepoUrl: string;
    paperUrl: string;
    originRepoUrl: string;
    downloadUrl: string;
    description: string;
    label: string;
    isDefaultVersion: boolean;
  }
}
