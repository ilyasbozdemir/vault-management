import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
const USERS_COLLECTION = 'users';


export const createUser = async (userData) => {
  try {
    const newUserRef = await addDoc(collection(db, USERS_COLLECTION), userData);
    console.log('Yeni kullanıcı başarıyla oluşturuldu:', newUserRef.id);
    return newUserRef.id;
  } catch (error) {
    console.error('Kullanıcı oluşturulurken hata oluştu:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('Kullanıcı bulunamadı.');
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      uid: userData.uid,
      email: userData.email,
      name: userData.name || '',
      avatarURL: userData.avatarURL || '',
      role: userData.role || 'user',
    };
  } catch (error) {
    console.error('Kullanıcı bilgileri alınırken hata oluştu:', error);
    throw error;
  }
};


export const updateUserProfile = async (uid, profileData) => {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, uid);
  
      await updateDoc(userDocRef, profileData);
      console.log('Profil başarıyla güncellendi.');
    } catch (error) {
      console.error('Profil güncellenirken hata oluştu:', error);
      throw error;
    }
  };


  export const getAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return users;
    } catch (error) {
      console.error("Kullanıcı verileri çekilirken hata oluştu:", error);
      throw error;
    }
  };
  