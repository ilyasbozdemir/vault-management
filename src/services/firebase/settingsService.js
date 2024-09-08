import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const SETTINGS_DOC_ID = "appSettings"; 

export const getAppSettings = async () => {
  const docRef = doc(db, "settings", SETTINGS_DOC_ID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return {
      appName: "vault-management",
      theme: "light",
      notificationsEnabled: true,
      maxUploadSize: 5,
      logoURL: "", 
    };
  }
};


export const updateAppSettings = async (settings) => {
  const docRef = doc(db, "settings", SETTINGS_DOC_ID);
  await setDoc(docRef, settings);
};
