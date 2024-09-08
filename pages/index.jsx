import React, { useEffect, useState } from "react";
import { Box, Grid, GridItem, Heading, Text, Divider } from "@chakra-ui/react";
import axios from "axios";
import RequireAuth from "../src/components/RequireAuth";
import Head from "next/head";

function DashboardPage() {
  const [serverStatus, setServerStatus] = useState({
    uptime: "Yükleniyor...",
    cpuUsage: "Yükleniyor...",
    memoryUsage: "Yükleniyor...",
  });
  const [databaseStatuses, setDatabaseStatuses] = useState([]);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await axios.get("/api/server-status");
        setServerStatus(response.data);
      } catch (error) {
        console.error("Sunucu durumu alınamadı:", error);
      }
    };
    const fetchDatabaseStatuses = async () => {
      try {
        const response = await axios.get("/api/database-status");
        setDatabaseStatuses(response.data.dbStatuses);
      } catch (error) {
        console.error("Veritabanı durumu alınamadı:", error);
      }
    };

    fetchDatabaseStatuses();
    fetchServerStatus();
  }, []);

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
      <Box p={4}>
        <Head>
          <title>
            {appSettings ? `${appSettings.appName} • Ana Sayfa` : "Ana Sayfa"}
          </title>
        </Head>
        <Heading mb={6}>Veritabanı Yönetim Paneli</Heading>

        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {databaseStatuses.map((db, index) => (
            <GridItem
              key={index}
              w="100%"
              h="150px"
              bg={db.isConnected === "Bağlı" ? "green.500" : "red.500"}
              color="white"
              p={4}
            >
              <Heading size="md">{db.name}</Heading>
              <Text mt={4} fontSize="xl">
                {db.isConnected}
              </Text>
              <Text fontSize="sm">Boyut: {db.size}</Text>
            </GridItem>
          ))}
        </Grid>

        <Divider my={8} />

        <Box>
          <Heading size="md" mb={4}>
            Sunucu Durumu
          </Heading>
          <Text>- Sunucu Çalışma Süresi: {serverStatus.uptime}</Text>
          <Text>- CPU Kullanımı: {serverStatus.cpuUsage}</Text>
          <Text>- Bellek Kullanımı: {serverStatus.memoryUsage}</Text>
        </Box>

        <Divider my={8} />
      </Box>
    </RequireAuth>
  );
}

export default DashboardPage;
