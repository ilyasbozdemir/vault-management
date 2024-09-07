import {
    addDbSetting,
    deleteDbSetting,
    getAllDbSettings,
    updateDbSetting,
  } from "../../src/services/firebase/dbSettingsService";
  
  export default async function handler(req, res) {
    const { method } = req;
  
    switch (method) {
      case "GET":
        try {
          const { owner, isDev, isLocalDB } = req.query;
  
          // Tüm ayarları alıyoruz
          const settings = await getAllDbSettings();
  
          // Eğer query parametreleri yoksa tüm ayarları döndür
          if (!owner && isDev === undefined && isLocalDB === undefined) {
            res.status(200).json({ settings, isSuccess: true });
            return;
          }
  
          // Filtreleme işlemi
          const filteredSettings = settings.filter((setting) => {
            let matches = true;
  
            // owner varsa filtrele
            if (owner) {
              matches = matches && setting.owner === owner;
            }
  
            // isDev varsa boolean olarak filtrele
            if (isDev !== undefined) {
              matches = matches && setting.isDev === (isDev === "true");
            }
  
            // isLocalDB varsa boolean olarak filtrele
            if (isLocalDB !== undefined) {
              matches = matches && setting.isLocalDB === (isLocalDB === "true");
            }
  
            return matches;
          });
  
          // Tek bir sonuç dönecek ve connection string oluşturulacak
          if (filteredSettings.length > 0) {
            const setting = filteredSettings[0];
  
            // Connection string'i oluştur
            let connectionString = "";
  
            // Servername ve instanceName'i birleştir
            if (setting.servername) {
              connectionString += `Server=${setting.servername}`;
              if (setting.instanceName) {
                connectionString += `\\${setting.instanceName}`;
              }
              connectionString += ";";
            }
  
            if (setting.dbname) {
              connectionString += `Database=${setting.dbname};`;
            }
  
            // Eğer Integrated Security aktifse bu kullanılır, değilse UserId ve Password eklenir
            if (setting.integratedSecurity) {
              connectionString += `Integrated Security=True;`;
            } else {
              if (setting.userId) {
                connectionString += `User Id=${setting.userId};`;
              }
              if (setting.password) {
                connectionString += `Password=${setting.password};`;
              }
            }
  
            if (setting.trustServerCertificate !== undefined) {
              connectionString += `TrustServerCertificate=${setting.trustServerCertificate};`;
            }
  
            // Connection string tamamsa başarıyı döndür
            res.status(200).json({ connectionString, isSuccess: true });
          } else {
            res.status(404).json({
              message: "Filtreye uygun sonuç bulunamadı",
              isSuccess: false,
            });
          }
        } catch (error) {
          res.status(500).json({
            error: "DB ayarları yüklenirken bir hata oluştu",
            isSuccess: false,
          });
        }
        break;
  
      case "POST":
        try {
          const newSetting = req.body;
          const result = await addDbSetting(newSetting);
          res.status(201).json({ result, isSuccess: true });
        } catch (error) {
          res.status(500).json({
            error: "DB ayarı eklenirken bir hata oluştu",
            isSuccess: false,
          });
        }
        break;
  
      case "PUT":
        try {
          const { id, updatedSetting } = req.body;
          await updateDbSetting(id, updatedSetting);
          res.status(200).json({ message: "DB ayarı başarıyla güncellendi", isSuccess: true });
        } catch (error) {
          res.status(500).json({
            error: "DB ayarı güncellenirken bir hata oluştu",
            isSuccess: false,
          });
        }
        break;
  
      case "DELETE":
        try {
          const { id } = req.body;
          await deleteDbSetting(id);
          res.status(200).json({ message: "DB ayarı başarıyla silindi", isSuccess: true });
        } catch (error) {
          res.status(500).json({
            error: "DB ayarı silinirken bir hata oluştu",
            isSuccess: false,
          });
        }
        break;
  
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
  