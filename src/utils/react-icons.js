// utils/react-icons.js
import { FaHome, FaUsers, FaDatabase, FaKey, FaCogs, FaFileAlt } from "react-icons/fa";

const iconMap = {
  FaHome: FaHome,
  FaUsers: FaUsers,
  FaDatabase: FaDatabase,
  FaKey: FaKey,
  FaCogs: FaCogs,
  FaFileAlt: FaFileAlt,
};

// İkon adını alıp, doğru JSX bileşenini döndüren fonksiyon
export const getIcon = (iconName) => {
  return iconMap[iconName] || null; // Eğer ikon adı yanlışsa null döner
};