import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  useDisclosure,
  IconButton,
  Collapse,
  FormHelperText,
  TableContainer,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  getAllApiSettings,
  addApiSetting,
  updateApiSetting,
  deleteApiSetting,
} from "../src/services/firebase/apiSettingsService";
import AlertComponent from "../src/components/AlertComponent";
import Head from "next/head";
import RequireAuth from "../src/components/RequireAuth";
import { getAppSettings } from "../src/services/firebase/settingsService";

const ApiSettings = () => {
  const [apiSettings, setApiSettings] = useState([]);
  const [formState, setFormState] = useState({
    id: null, // Otomatik olarak ayarlanacak
    ipAddress: "", // IP Adresi
    isBlacklisted: false, // Kara liste durumu
    description: "", // Açıklama (Opsiyonel)
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
    onConfirm: null,
  });
  const [selectedSettingId, setSelectedSettingId] = useState(null);
  const { isOpen, onToggle } = useDisclosure();

  // API Settings listeleme
  const fetchApiSettings = async () => {
    try {
      const settings = await getAllApiSettings();
      setApiSettings(settings);
    } catch (error) {
      console.error("API ayarları alınırken hata oluştu:", error);
      setError("API ayarları alınırken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchApiSettings();
  }, []);

  // Yeni id'yi ayarla (listenin en büyük id'si + 1)
  const getNextId = () => {
    if (apiSettings.length > 0) {
      const maxId = Math.max(...apiSettings.map((setting) => setting.id));
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
      ipAddress: "",
      isBlacklisted: false,
      description: "",
    });
    setSelectedSettingId(null);
  };

  // API Setting ekleme
  const handleAdd = async () => {
    try {
      const newSetting = {
        ...formState,
        id: getNextId(),
      };
      await addApiSetting(newSetting);
      fetchApiSettings();
      resetForm(); // Formu sıfırla
      setError("");
      setSuccess("API ayarı başarıyla eklendi.");
    } catch (error) {
      console.error("API ayarı eklenirken hata oluştu:", error);
      setError("API ayarı eklenirken bir hata oluştu.");
    }
  };

  // API Setting güncelleme
  const handleUpdate = async () => {
    try {
      const updatedSetting = { ...formState };
      await updateApiSetting(selectedSettingId, updatedSetting);
      fetchApiSettings();
      resetForm();
      setError("");
      setSuccess("API ayarı başarıyla güncellendi.");
    } catch (error) {
      console.error("API ayarı güncellenirken hata oluştu:", error);
      setError("API ayarı güncellenirken bir hata oluştu.");
    }
  };

  // Güncelleme başlatma
  const handleEdit = (setting) => {
    setFormState({
      id: setting.id,
      ipAddress: setting.ipAddress,
      isBlacklisted: setting.isBlacklisted,
      description: setting.description || "",
    });
    setSelectedSettingId(setting.id);
  };

  // API Setting silme
  const handleDelete = (id) => {
    setAlert({
      visible: true,
      type: "error",
      message: "Bu işlem geri alınamaz. Bu API ayarını silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          await deleteApiSetting(id);
          fetchApiSettings();
          setAlert({ ...alert, visible: false });
          setError("");
          setSuccess("API ayarı başarıyla silindi.");
        } catch (error) {
          console.error("API ayarı silinirken hata oluştu:", error);
          setError("API ayarı silinirken bir hata oluştu.");
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
        <title>{appSettings ? `${appSettings.appName} • API Ayarları` : 'API Ayarları'}</title>
      </Head>

      <Box p={4}>
        {/* Uyarı Mesajları */}
        {error && (
          <AlertComponent status="error" title="Hata" description={error} onClose={() => setError("")} />
        )}
        {success && (
          <AlertComponent status="success" title="Başarılı" description={success} onClose={() => setSuccess("")} />
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormLabel mb={0}>API Ayarları</FormLabel>
            <IconButton
              icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={onToggle}
              aria-label="Toggle Form"
            />
          </Box>

          <Collapse in={isOpen} animateOpacity>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>IP Adresi</FormLabel>
                  <Input name="ipAddress" value={formState.ipAddress} onChange={handleChange} />
                  <FormHelperText color="gray.500">
                    Lütfen geçerli bir IP adresi girin.
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Kara Liste</FormLabel>
                  <Switch name="isBlacklisted" isChecked={formState.isBlacklisted} onChange={handleChange} />
                  <FormHelperText color="gray.500">
                    Eğer bu IP adresi yasaklıysa bu seçeneği işaretleyin.
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>Açıklama</FormLabel>
                  <Input name="description" value={formState.description} onChange={handleChange} />
                  <FormHelperText color="gray.500">
                    Bu IP için bir açıklama ekleyin (opsiyonel).
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </Grid>
            <Button colorScheme="blue" onClick={selectedSettingId ? handleUpdate : handleAdd} mt={4}>
              {selectedSettingId ? "Güncelle" : "Ekle"}
            </Button>
            {selectedSettingId && (
              <Button colorScheme="gray" onClick={resetForm} mt={4} ml={4}>
                İptal
              </Button>
            )}
          </Collapse>
        </Box>

        {/* Listeleme */}
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>IP Adresi</Th>
                <Th>Kara Liste</Th>
                <Th>Açıklama</Th>
                <Th>Aksiyonlar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {apiSettings.map((setting) => (
                <Tr key={setting.id}>
                  <Td>{setting.id}</Td>
                  <Td>{setting.ipAddress}</Td>
                  <Td>{setting.isBlacklisted ? "Evet" : "Hayır"}</Td>
                  <Td>{setting.description}</Td>
                  <Td>
                    <Button colorScheme="yellow" onClick={() => handleEdit(setting)}>
                      Güncelle
                    </Button>
                    <Button colorScheme="red" ml={2} onClick={() => handleDelete(setting.id)}>
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

export default ApiSettings;
