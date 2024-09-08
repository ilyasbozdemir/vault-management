import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Grid,
  GridItem,
  Select,
  FormHelperText,
} from "@chakra-ui/react";
import {
  getAppSettings,
  updateAppSettings,
} from "../src/services/firebase/settingsService";
import AlertComponent from "../src/components/AlertComponent";
import Head from "next/head";
import RequireAuth from "../src/components/RequireAuth";

const Settings = () => {
  const [settings, setSettings] = useState({
    appName: "",
    theme: "light",
    notificationsEnabled: true,
    maxUploadSize: 5, // MB cinsinden
    logoURL: "", // Logo URL alanı
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Ayarları al
  const fetchSettings = async () => {
    try {
      const appSettings = await getAppSettings();
      setSettings(appSettings);
    } catch (error) {
      console.error("Ayarlar alınırken hata oluştu:", error);
      setError("Ayarlar alınırken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Form inputları güncelleme
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Ayarları güncelle
  const handleUpdate = async () => {
    try {
      await updateAppSettings(settings);
      setSuccess("Ayarlar başarıyla güncellendi.");
    } catch (error) {
      console.error("Ayarlar güncellenirken hata oluştu:", error);
      setError("Ayarlar güncellenirken bir hata oluştu.");
    }
  };

  const [appSettings, setAppSettings] = useState(null);

  // App Settings (Başlık için)
  const fetchAppSettings = async () => {
    try {
      const settings = await getAppSettings();
      setAppSettings(settings);
    } catch (error) {
      console.error("Uygulama ayarları alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchAppSettings();
  }, []);

  return (
    <RequireAuth>
      <Head>
        <title>
        {appSettings ? `${appSettings.appName} • Ayarlar` : "Ayarlar"}
        </title>
      </Head>

      <Box p={4}>
        {/* Uyarı Mesajları */}
        {error && (
          <AlertComponent
            status="error"
            title="Hata"
            description={error}
            onClose={() => setError("")}
          />
        )}
        {success && (
          <AlertComponent
            status="success"
            title="Başarılı"
            description={success}
            onClose={() => setSuccess("")}
          />
        )}

        {/* Ayar Formu */}
        <Box borderWidth={1} borderRadius="lg" p={4} mb={8}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Uygulama Adı</FormLabel>
                <Input
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Logo URL</FormLabel>
                <Input
                  name="logoURL"
                  value={settings.logoURL}
                  onChange={handleChange}
                />
                <FormHelperText>
                  Logo olarak kullanılacak URL. Örn:
                  https://example.com/logo.png
                </FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Tema</FormLabel>
                <Select
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                >
                  <option value="light">Açık</option>
                  <option value="dark">Koyu</option>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Bildirimler</FormLabel>
                <Switch
                  name="notificationsEnabled"
                  isChecked={settings.notificationsEnabled}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Maksimum Yükleme Boyutu (MB)</FormLabel>
                <Input
                  name="maxUploadSize"
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Button colorScheme="blue" onClick={handleUpdate} mt={4}>
            Güncelle
          </Button>
        </Box>
      </Box>
    </RequireAuth>
  );
};

export default Settings;
