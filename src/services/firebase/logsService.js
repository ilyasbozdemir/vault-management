import { collection, query, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";

const LOGS_COLLECTION = "logs";

// Tüm logları al
export const getAllLogs = async () => {
  const q = query(collection(db, LOGS_COLLECTION));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Yeni log ekle
export const addLog = async (logData) => {
  await addDoc(collection(db, LOGS_COLLECTION), logData);
};

// Log sil
export const deleteLog = async (id) => {
  const logDocRef = doc(db, LOGS_COLLECTION, id);
  await deleteDoc(logDocRef);
};
