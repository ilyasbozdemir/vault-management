import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  useDisclosure,
  IconButton,
  Collapse,
  TableContainer,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  getAllLogs,
  deleteLog,
} from "../src/services/firebase/logsService";
import AlertComponent from "../src/components/AlertComponent";
import Head from "next/head";
import RequireAuth from "../src/components/RequireAuth";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({
    logType: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
    onConfirm: null,
  });
  const { isOpen, onToggle } = useDisclosure();

  // Log kayıtlarını al
  const fetchLogs = async () => {
    try {
      const logsData = await getAllLogs();
      setLogs(logsData);
    } catch (error) {
      console.error("Loglar alınırken hata oluştu:", error);
      setError("Loglar alınırken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filtreleme
  const applyFilter = () => {
    let filteredLogs = logs;

    if (filter.logType) {
      filteredLogs = filteredLogs.filter((log) => log.type === filter.logType);
    }

    if (filter.startDate) {
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) >= new Date(filter.startDate)
      );
    }

    if (filter.endDate) {
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) <= new Date(filter.endDate)
      );
    }

    setLogs(filteredLogs);
  };

  // Log silme
  const handleDelete = (id) => {
    setAlert({
      visible: true,
      type: "error",
      message: "Bu log kaydını silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          await deleteLog(id);
          fetchLogs(); // Tekrar listeleme
          setAlert({ ...alert, visible: false });
          setSuccess("Log kaydı başarıyla silindi.");
        } catch (error) {
          console.error("Log kaydı silinirken hata oluştu:", error);
          setError("Log kaydı silinirken bir hata oluştu.");
        }
      },
    });
  };

  return (
    <RequireAuth>
      <Head>
        <title>Log Yönetimi • rsrichsoul</title>
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

        {/* Filtreleme */}
        <Box borderWidth={1} borderRadius="lg" p={4} mb={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormLabel mb={0}>Filtreler</FormLabel>
            <IconButton
              icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={onToggle}
              aria-label="Toggle Filters"
            />
          </Box>

          <Collapse in={isOpen} animateOpacity>
            <FormControl>
              <FormLabel>Log Tipi</FormLabel>
              <Select
                name="logType"
                value={filter.logType}
                onChange={(e) => setFilter({ ...filter, logType: e.target.value })}
              >
                <option value="">Hepsi</option>
                <option value="error">Hata</option>
                <option value="info">Bilgi</option>
                <option value="warning">Uyarı</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Başlangıç Tarihi</FormLabel>
              <Input
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Bitiş Tarihi</FormLabel>
              <Input
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              />
            </FormControl>
            <Button mt={4} onClick={applyFilter} colorScheme="blue">
              Filtre Uygula
            </Button>
          </Collapse>
        </Box>

        {/* Log Listeleme */}
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Log Tipi</Th>
                <Th>Tarih</Th>
                <Th>Mesaj</Th>
                <Th>Aksiyonlar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {logs.map((log) => (
                <Tr key={log.id}>
                  <Td>{log.id}</Td>
                  <Td>{log.type}</Td>
                  <Td>{new Date(log.timestamp).toLocaleString()}</Td>
                  <Td>{log.message}</Td>
                  <Td>
                    <Button colorScheme="red" onClick={() => handleDelete(log.id)}>
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

export default Logs;
