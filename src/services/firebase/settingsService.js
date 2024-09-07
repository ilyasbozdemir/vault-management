import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const SETTINGS_DOC_ID = "appSettings"; // Belgenin ID'si

// Uygulama ayarlarını al
export const getAppSettings = async () => {
  const docRef = doc(db, "settings", SETTINGS_DOC_ID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // Belge yoksa, varsayılan ayarları döndür
    return {
      appName: "rsrichsoul",
      theme: "light",
      notificationsEnabled: true,
      maxUploadSize: 5,
      logoURL: "", // Varsayılan boş logo URL
    };
  }
};

// Uygulama ayarlarını güncelle
export const updateAppSettings = async (settings) => {
  const docRef = doc(db, "settings", SETTINGS_DOC_ID);
  await setDoc(docRef, settings);
};
