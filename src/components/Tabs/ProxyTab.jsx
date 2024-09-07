import {
  Flex,
  FormControl,
  Select,
  VStack,
  Input,
  Checkbox,
  Button,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormLabel,
  HStack,
  IconButton,
  useToast,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import {
  fetchProxies,
  addProxy as addProxyService,
  updateProxy as updateProxyService,
  deleteProxy as deleteProxyService,
} from "../../services/firebase/proxyService";

function ProxyTab() {
  const [editIndex, setEditIndex] = useState(-1);
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [proxyInput, setProxyInput] = useState({
    protocol: "",
    ip: "",
    port: "",
    https: false,
    isActive: true,
  });

  const toast = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await fetchProxies();
        setProxies(data);
      } catch (error) {
        toast({
          title: "Proxies yüklenirken bir hata oluştu.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const saveProxy = async () => {
    if (!proxyInput.protocol || !proxyInput.ip || !proxyInput.port) {
      toast({
        title: "Lütfen tüm alanları doldurun.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (editIndex === -1) {
      await addProxy();
    } else {
      await updateProxy();
    }
  };

  const addProxy = async () => {
    try {
      const id = await addProxyService(proxyInput);
      setProxies([...proxies, { ...proxyInput, id }]);
      resetForm();
      toast({
        title: "Proxy eklendi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Proxy eklenirken bir hata oluştu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateProxy = async () => {
    const proxy = proxies[editIndex];
    try {
      await updateProxyService(proxy.id, proxyInput);
      const updatedProxies = [...proxies];
      updatedProxies[editIndex] = { ...proxyInput, id: proxy.id };
      setProxies(updatedProxies);
      resetForm();
      toast({
        title: "Proxy güncellendi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Proxy güncellenirken bir hata oluştu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProxyService(id);
      setProxies(proxies.filter((proxy) => proxy.id !== id));
      toast({
        title: "Proxy silindi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Proxy silinirken bir hata oluştu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const editProxy = (index) => {
    const proxy = proxies[index];
    setEditIndex(index);
    setProxyInput(proxy);
  };

  const handleInputChange = (field, value) => {
    setProxyInput((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setProxyInput({
      protocol: "",
      ip: "",
      port: "",
      https: false,
      isActive: true,
    });
    setEditIndex(-1);
  };

  const tableVariant = useBreakpointValue({
    base: "simple",
    sm: "striped",
    md: "simple",
  });

  return (
    <>
      <VStack spacing={6} align="stretch">
        <FormControl id="proxy-settings">
          <FormLabel>Proxy Ayarları</FormLabel>
          <Flex
            direction={{ base: "column", md: "column" }}
            gap={3}
            mb={4}
          >
            <Select
              value={proxyInput.protocol}
              onChange={(e) => handleInputChange("protocol", e.target.value)}
              placeholder="Protokol"
              focusBorderColor="purple.500"
            >
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="socks4">SOCKS4</option>
              <option value="socks5">SOCKS5</option>
            </Select>
            <Input
              value={proxyInput.ip}
              onChange={(e) => handleInputChange("ip", e.target.value)}
              placeholder="IP Adresi"
              focusBorderColor="purple.500"
            />
            <Input
              type="number"
              value={proxyInput.port}
              onChange={(e) => handleInputChange("port", e.target.value)}
              placeholder="Port"
              focusBorderColor="purple.500"
            />
            <Checkbox
              isChecked={proxyInput.https}
              onChange={(e) => handleInputChange("https", e.target.checked)}
            >
              Güvenlik Katmanı var mı? (http/https)
            </Checkbox>

            <Checkbox
              isChecked={proxyInput.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
            >
              Aktif
            </Checkbox>
            <Button
              onClick={saveProxy}
              leftIcon={editIndex === -1 ? <AddIcon /> : <CheckIcon />}
              colorScheme="purple"
            >
              {editIndex === -1 ? "Proxy Ekle" : "Kaydet"}
            </Button>
          </Flex>
          <Box overflowX="auto">
            <Table variant={tableVariant} size="sm" mt={4}>
              <TableCaption>
                Bu tablo, çeşitli proxy sunucularının ayrıntılarını listeler. Her
                satırda, proxy'nin protokolü, IP adresi, port numarası, HTTPS
                desteği, aktif durumu ve olası eylemler gösterilir.
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Sıra No</Th>
                  <Th>Protokol</Th>
                  <Th>IP Adresi</Th>
                  <Th>Port</Th>
                  <Th>HTTPS</Th>
                  <Th>Aktif</Th>
                  <Th>Eylemler</Th>
                </Tr>
              </Thead>
              <Tbody>
                {proxies.map((proxy, index) => (
                  <Tr key={proxy.id}>
                    <Td>{index + 1}</Td> {/* Sıra numarası eklendi */}
                    <Td>{proxy.protocol}</Td>
                    <Td>{proxy.ip}</Td>
                    <Td>{proxy.port}</Td>
                    <Td>{proxy.https ? "Evet" : "Hayır"}</Td>
                    <Td>{proxy.isActive ? "Evet" : "Hayır"}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          icon={<EditIcon />}
                          colorScheme="blue"
                          size="sm"
                          onClick={() => editProxy(index)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDelete(proxy.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </FormControl>
      </VStack>
    </>
  );
}

export default ProxyTab;
