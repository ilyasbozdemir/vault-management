import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";

const API_SETTINGS_COLLECTION = "apiSettings";

// Tüm API ayarlarını getir
export const getAllApiSettings = async () => {
  const q = query(collection(db, API_SETTINGS_COLLECTION));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Yeni bir API ayarı ekle
export const addApiSetting = async (newSetting) => {
  await addDoc(collection(db, API_SETTINGS_COLLECTION), newSetting);
};

// Bir API ayarını güncelle
export const updateApiSetting = async (id, updatedSetting) => {
  const settingDocRef = doc(db, API_SETTINGS_COLLECTION, id);
  await updateDoc(settingDocRef, updatedSetting);
};

// Bir API ayarını sil
export const deleteApiSetting = async (id) => {
  const settingDocRef = doc(db, API_SETTINGS_COLLECTION, id);
  await deleteDoc(settingDocRef);
};
