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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormHelperText,
  Collapse,
  useDisclosure,
  Select,
  IconButton,
  TableContainer,
  TableCaption,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  getAllDbSettings,
  addDbSetting,
  updateDbSetting,
  deleteDbSetting,
} from "../src/services/firebase/dbSettingsService";
import AlertComponent from "../src/components/AlertComponent";
import Head from "next/head";
import RequireAuth from "../src/components/RequireAuth";
import { getAppSettings } from "../src/services/firebase/settingsService";

const DbSettings = () => {
  const [dbSettings, setDbSettings] = useState([]);
  const [formState, setFormState] = useState({
    id: null, // Otomatik olarak ayarlanacak
    isDev: false,
    isLocalDB: false,
    servername: "", // Sunucu adı
    instanceName: "", // Instance adı
    useInstanceName: false, // Instance adı kullanılacak mı?
    dbname: "",
    userId: "",
    password: "",
    integratedSecurity: true, // Varsayılan olarak açık
    trustServerCertificate: false,
    owner: "", // Yeni eklenen alan
    provider: "MSSQL", // Varsayılan provider
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
    onConfirm: null,
  });
  const [selectedSettingId, setSelectedSettingId] = useState(null); // Güncellenecek ayarın ID'si
  const { isOpen, onToggle } = useDisclosure(); // Chakra UI'den collapse kontrolü

  // DB Settings listeleme
  const fetchDbSettings = async () => {
    try {
      const settings = await getAllDbSettings();
      setDbSettings(settings);
    } catch (error) {
      console.error("DB ayarları alınırken hata oluştu:", error);
      setError("DB ayarları alınırken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchDbSettings();
  }, []);

  // Yeni id'yi ayarla (listenin en büyük id'si + 1)
  const getNextId = () => {
    if (dbSettings.length > 0) {
      const maxId = Math.max(...dbSettings.map((setting) => setting.id));
      return maxId + 1;
    }
    return 1; // Eğer liste boşsa 1'den başlar
  };

  // Form inputları güncelleme
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Formu sıfırlama
  const resetForm = () => {
    setFormState({
      id: null,
      isDev: false,
      isLocalDB: false,
      servername: "",
      instanceName: "",
      useInstanceName: false,
      dbname: "",
      userId: "",
      password: "",
      integratedSecurity: true,
      trustServerCertificate: false,
      owner: "",
      provider: "MSSQL",
    });
    setSelectedSettingId(null);
  };

  const getFullServerName = () => {
    if (formState.useInstanceName && formState.instanceName) {
      return `${formState.servername}\\${formState.instanceName}`;
    }
    return formState.servername;
  };

  // DB Setting ekleme
  const handleAdd = async () => {
    try {
      const newSetting = {
        ...formState,
        servername: getFullServerName(), // Full server name'i ayarla
        id: getNextId(), // Yeni id'yi ata
      };
      await addDbSetting(newSetting);
      fetchDbSettings();
      resetForm(); // Formu sıfırla
      setError("");
      setSuccess("DB ayarı başarıyla eklendi.");
    } catch (error) {
      console.error("DB ayarı eklenirken hata oluştu:", error);
      setError("DB ayarı eklenirken bir hata oluştu.");
    }
  };

  // DB Setting güncelleme
  const handleUpdate = async () => {
    try {
      const updatedSetting = {
        ...formState,
        servername: getFullServerName(), // Full server name'i ayarla
      };
      await updateDbSetting(selectedSettingId, updatedSetting); // Güncellenen ayarı kaydet
      fetchDbSettings();
      resetForm(); // Formu sıfırla
      setError("");
      setSuccess("DB ayarı başarıyla güncellendi.");
    } catch (error) {
      console.error("DB ayarı güncellenirken hata oluştu:", error);
      setError("DB ayarı güncellenirken bir hata oluştu.");
    }
  };

  // Güncelleme başlatma
  const handleEdit = (setting) => {
    setFormState({
      id: setting.id,
      isDev: setting.isDev,
      isLocalDB: setting.isLocalDB,
      servername: setting.servername,
      instanceName: setting.instanceName || "",
      useInstanceName: setting.useInstanceName || false,
      dbname: setting.dbname,
      userId: setting.userId,
      password: setting.password,
      integratedSecurity: setting.integratedSecurity,
      trustServerCertificate: setting.trustServerCertificate,
      owner: setting.owner || "",
      provider: setting.provider || "MSSQL",
    });
    setSelectedSettingId(setting.id);
  };

  // DB Setting silme
  const handleDelete = (id) => {
    setAlert({
      visible: true,
      type: "error",
      message:
        "Bu işlem geri alınamaz. Bu DB ayarını silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          await deleteDbSetting(id);
          fetchDbSettings(); // Tekrar listelemek için
          setAlert({ ...alert, visible: false });
          setError("");
          setSuccess("DB ayarı başarıyla silindi.");
        } catch (error) {
          console.error("DB ayarı silinirken hata oluştu:", error);
          setError("DB ayarı silinirken bir hata oluştu.");
        }
      },
    });
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
            {appSettings ? `${appSettings.appName} • Veritabanı Ayarları` : "Veritabanı Ayarları"}
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
        {alert.visible && (
          <AlertComponent
            status={alert.type}
            title={alert.type === "error" ? "Uyarı" : "Bilgi"}
            description={alert.message}
            onClose={() => setAlert({ ...alert, visible: false })}
            onConfirm={alert.onConfirm}
          />
        )}

        {/* Form */}
        <Box borderWidth={1} borderRadius="lg" p={4} mb={8}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onClick={onToggle}
            aria-label="Toggle Form"
          >
            <FormLabel mb={0}>Veritabanı Ayarları</FormLabel>
            <IconButton
              icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              aria-label="Toggle Form"
            />
          </Box>

          <Collapse mt={5} in={isOpen} animateOpacity>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>Owner</FormLabel>
                  <Input
                    name="owner"
                    value={formState.owner}
                    onChange={handleChange}
                  />
                  <FormHelperText color="gray.500">
                    Veritabanı bağlantı cümlesinin sahibi. Farklı ortamlar için
                    '-' kullanın. Örnek: system-main-prod, system-config.
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>Provider</FormLabel>
                  <Select
                    name="provider"
                    value={formState.provider}
                    onChange={handleChange}
                  >
                    <option value="MSSQL">MSSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                  </Select>
                  <FormHelperText color="gray.500">
                    Veritabanı Sağlayıcısı
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack justifyContent="center" alignItems="center">
                  <FormControl>
                    <FormLabel>Servername</FormLabel>
                    <Input
                      name="servername"
                      value={formState.servername}
                      onChange={handleChange}
                    />
                    <FormHelperText color="gray.500">
                      Sunucunun Adı
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Instance Name</FormLabel>
                    <Input
                      name="instanceName"
                      value={formState.instanceName}
                      onChange={handleChange}
                      isDisabled={!formState.useInstanceName}
                    />
                    <FormHelperText color="gray.500">
                      SQL Server Instance Adı
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Use Instance Name</FormLabel>
                    <Switch
                      name="useInstanceName"
                      isChecked={formState.useInstanceName}
                      onChange={handleChange}
                    />
                    <FormHelperText color="gray.500">
                      Instance Adı Kullanılsın mı?
                    </FormHelperText>
                  </FormControl>
                </HStack>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack justifyContent="center" alignItems="center">
                  <FormControl>
                    <FormLabel>isDev</FormLabel>
                    <Switch
                      name="isDev"
                      isChecked={formState.isDev}
                      onChange={handleChange}
                    />
                    <FormHelperText color="gray.500">
                      Geliştirme modunda mı?
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel>isLocalDB</FormLabel>
                    <Switch
                      name="isLocalDB"
                      isChecked={formState.isLocalDB}
                      onChange={handleChange}
                    />
                    <FormHelperText color="gray.500">
                      Yerel Veritabanı mı?
                    </FormHelperText>
                  </FormControl>
                </HStack>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>DB Name</FormLabel>
                  <Input
                    name="dbname"
                    value={formState.dbname}
                    onChange={handleChange}
                  />
                  <FormHelperText color="gray.500">
                    Veritabanının Adı
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>User ID</FormLabel>
                  <Input
                    name="userId"
                    value={formState.userId}
                    onChange={handleChange}
                    isDisabled={formState.integratedSecurity} // Integrated Security açıkken kapalı
                  />
                  <FormHelperText color="gray.500">
                    Veritabanı Kullanıcı Adı (Integrated Security kapalıysa)
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <HStack justifyContent="center" alignItems="center">
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      name="password"
                      value={formState.password}
                      onChange={handleChange}
                      isDisabled={formState.integratedSecurity} // Integrated Security açıkken kapalı
                    />
                    <FormHelperText color="gray.500">
                      Veritabanı Şifresi (Integrated Security kapalıysa)
                    </FormHelperText>
                  </FormControl>
                </HStack>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Integrated Security</FormLabel>
                  <Switch
                    name="integratedSecurity"
                    isChecked={formState.integratedSecurity}
                    onChange={handleChange}
                  />
                  <FormHelperText color="gray.500">
                    Windows kimlik doğrulaması kullan
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Trust Server Certificate</FormLabel>
                  <Switch
                    name="trustServerCertificate"
                    isChecked={formState.trustServerCertificate}
                    onChange={handleChange}
                  />
                  <FormHelperText color="gray.500">
                    Sunucu Sertifikasına Güven
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </Grid>
            <Button
              colorScheme="blue"
              onClick={selectedSettingId ? handleUpdate : handleAdd}
              mt={4}
            >
              {selectedSettingId ? "Güncelle" : "Ekle"}
            </Button>
            {selectedSettingId && (
              <Button
                colorScheme="gray"
                onClick={resetForm} // İptal butonu
                mt={4}
                ml={4}
              >
                İptal
              </Button>
            )}
          </Collapse>
        </Box>

        {/* Listeleme */}

        <TableContainer>
          <Table variant="striped" colorScheme="teal" size="sm">
            <TableCaption>
              Veritabanı bağlantı cümlelerini içermektedir. hassas
              bilgilerirdir. güncelleme yapmayınız
            </TableCaption>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Provider</Th> {/* Sağlayıcı */}
                <Th>Servername</Th>
                <Th>Instance Name</Th> {/* Instance Adı */}
                <Th>DB Name</Th>
                <Th>Owner</Th> {/* Yeni alan */}
                <Th>Aksiyonlar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dbSettings.map((setting) => (
                <Tr key={setting.id}>
                  <Td>{setting.id}</Td>
                  <Td>{setting.provider}</Td> {/* Sağlayıcı */}
                  <Td>{setting.servername}</Td>
                  <Td>{setting.instanceName}</Td> {/* Instance Adı */}
                  <Td>{setting.dbname}</Td>
                  <Td>{setting.owner}</Td>
                  <Td>
                    <Button
                      colorScheme="yellow"
                      onClick={() => handleEdit(setting)}
                    >
                      Güncelle
                    </Button>
                    <Button
                      colorScheme="gray"
                      ml={2}
                      onClick={() => handleEdit(setting)}
                    >
                      Kopyala
                    </Button>
                    <Button
                      colorScheme="red"
                      ml={2}
                      onClick={() => handleDelete(setting.id)}
                    >
                      Sil
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </RequireAuth>
  );
};

export default DbSettings;
