import {
  checkDatabaseConnection,
  getDatabaseSize,
} from "../../src/services/databaseHealthService";
import { getAllDbSettings } from "../../src/services/firebase/dbSettingsService";

export default async function handler(req, res) {
  try {
    const { owner, isDev, isLocalDB } = req.query;

    const allDbSettings = await getAllDbSettings();

    const filteredSettings = allDbSettings.filter((db) => {
      let matches = true;

      if (owner) {
        matches = matches && db.owner === owner;
      }

      if (isDev !== undefined) {
        matches = matches && db.isDev === (isDev === "true");
      }

      if (isLocalDB !== undefined) {
        matches = matches && db.isLocalDB === (isLocalDB === "true");
      }

      return matches;
    });

    const dbStatuses = await Promise.all(
      filteredSettings.map(async (db) => {
        const isConnected = await checkDatabaseConnection(db.connectionString);

        let size = "Yok";
        if (isConnected) {
          size = await getDatabaseSize(db.connectionString);
        }

        return {
          name: db.dbname || db.servername,
          isConnected: isConnected ? "Bağlı" : "Bağlantı Yok",
          size: isConnected ? `${size} GB` : "Yok",
        };
      })
    );

    res.status(200).json({ dbStatuses });
  } catch (error) {
    res.status(500).json({ error: "Veritabanı durumu alınırken hata oluştu" });
  }
}
