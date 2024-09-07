import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";

const DB_SETTINGS_COLLECTION = "db_settings"; // Koleksiyon adı

// DB Settings listeleme
export const getAllDbSettings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, DB_SETTINGS_COLLECTION));
    const dbSettings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return dbSettings;
  } catch (error) {
    console.error("DB ayarları alınırken hata oluştu:", error);
    throw error;
  }
};

// DB Settings ekleme
export const addDbSetting = async (newSetting) => {
  try {
    const docRef = await addDoc(
      collection(db, DB_SETTINGS_COLLECTION),
      newSetting
    );
    return docRef.id;
  } catch (error) {
    console.error("DB ayarı eklenirken hata oluştu:", error);
    throw error;
  }
};

// DB Settings güncelleme
export const updateDbSetting = async (id, updatedSetting) => {
  try {
    const docRef = doc(db, DB_SETTINGS_COLLECTION, id);
    await updateDoc(docRef, updatedSetting);
  } catch (error) {
    console.error("DB ayarı güncellenirken hata oluştu:", error);
    throw error;
  }
};

// DB Settings silme
export const deleteDbSetting = async (id) => {
  try {
    const docRef = doc(db, DB_SETTINGS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("DB ayarı silinirken hata oluştu:", error);
    throw error;
  }
};
