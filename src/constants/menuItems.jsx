export const adminBasePath = ``;

export const menuItems = [
  {
    type: "link",
    title: "Anasayfa",
    href: "/",
    logoSrc: 'FaHome',
    iconColor: "blackAlpha.700",  // #4A5568
    roles: ["Admin"],
    id: "home",
  },
  {
    type: "link",
    title: "Kullanıcılar",
    href: `${adminBasePath}/users`,
    logoSrc: "FaUsers", // Kullanıcı ikonları için
    iconColor: "blue.500",
    roles: ["Admin"],
    id: "users-list",
  },
  {
    type: "link",
    title: "Veritabanı Ayarları",
    href: `${adminBasePath}/db-settings`,
    logoSrc: "FaDatabase", // Veritabanı ayarları ikonu
    iconColor: "green.500",
    roles: ["Admin", "DBA"],
    id: "db-settings",
  },
  {
    type: "link",
    title: "API Ayarları",
    href: `${adminBasePath}/api-settings`,
    logoSrc: "FaCogs", // API ayarları ikonu
    iconColor: "orange.500",
    roles: ["Admin", "Developer"],
    id: "api-settings",
  },
  {
    type: "link",
    title: "Sistem Logları",
    href: `${adminBasePath}/logs`,
    logoSrc: "FaFileAlt", // Log ikonları
    iconColor: "gray.500",
    roles: ["Admin", "Developer"],
    id: "system-logs",
  },
  {
    type: "link",
    title: "Ayarlar",
    href: `${adminBasePath}/settings`,
    logoSrc: "FaCogs",
    iconColor: "blue.500",
    roles: ["Admin"],
    id: "settings",
  },
];
