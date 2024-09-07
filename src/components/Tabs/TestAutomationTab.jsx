// src/components/Tabs/TestAutomationTab.js
import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";

const TestAutomationTab = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Yükleniyor durumu için state

  const isValidURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchTitle = async () => {
    if (!isValidURL(url)) {
      setError("Geçersiz URL formatı.");
      return;
    }

    setLoading(true); // Yükleniyor durumunu başlat
    setError(""); // Önceki hataları temizle
    try {
      const response = await fetch(
        `/api/puppeteer-test?url=${encodeURIComponent(url)}`
      );

      const responseBody = await response.text();

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${responseBody}`
        );
      }

      const data = JSON.parse(responseBody);
      setTitle(data.title);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setTitle("");
    } finally {
      setLoading(false); // Yükleniyor durumunu sonlandır
    }
  };

  const headingSize = useBreakpointValue({ base: "md", md: "lg" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Box p={5} maxW="full" mx="auto" boxShadow="lg" textAlign="center">
      <Heading mb={4} size={headingSize}>
        Sayfa Başlığını Test Et
      </Heading>
      <Text mb={4} fontSize={textSize}>
        Aşağıdaki formu kullanarak herhangi bir URL'nin başlığını test
        edebilirsiniz. Tarama sunucusunun işlevini doğru yapması için geçerli
        bir URL girmeniz gerekmektedir.
      </Text>
      <Input
        placeholder="URL girin"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        mb={3}
        size="lg"
        type="url"
      />
      <Button onClick={fetchTitle} isDisabled={loading} size="lg" mb={4}>
        {loading ? <Spinner size="sm" /> : "Başlığı Al"}
      </Button>
      {title && (
        <Box>
          <Text mt={4} fontSize={textSize}>
            Sayfa Başlığı: {title}
          </Text>
          <Alert status="success" mt={4} borderRadius="md">
            <AlertIcon />
            Otomasyon başarılı bir şekilde çalışıyor!
          </Alert>
        </Box>
      )}
      {error && (
        <Alert status="error" mt={4} borderRadius="md">
          <AlertIcon />
          Hata: {error}
        </Alert>
      )}
    </Box>
  );
};

export default TestAutomationTab;
