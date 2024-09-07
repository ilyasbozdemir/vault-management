import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  Button,
  Text,
  ButtonGroup,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  useBreakpointValue,
  Box,
  Spinner,
  Alert,
  AlertIcon,
  FormHelperText,
} from "@chakra-ui/react";
import {
  fetchEmailSettings,
  setEmailSettings,
  deleteEmailSettings,
} from "../../services/firebase/emailService";

function EmailTab() {
  const TabMenus = [
    {
      name: "Email Ayarları",
      tabComponent: <EmailSettings />,
      priority: 3,
    },
    {
      name: "Email Test",
      tabComponent: <EmailSendTest />,
      priority: 3,
    },
  ];

  const sortedTabs = TabMenus.sort((a, b) => a.priority - b.priority);

  return (
    <>
      <Tabs isFitted>
        <TabList
          mb="1em"
          overflowX="auto"
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {sortedTabs.map((tab, index) => (
            <Tab key={index}>{tab.name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {sortedTabs.map((tab, index) => (
            <TabPanel key={index}>{tab.tabComponent}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
}

const EmailSettings = () => {
  const [emailSettings, setEmailSettingsState] = useState({
    server: "",
    port: "",
    user: "",
    pass: "", // Şifreyi gösterme
    name: "",
    recipients: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    const loadEmailSettings = async () => {
      setLoading(true);
      try {
        const data = await fetchEmailSettings();
        if (data) {
          setEmailSettingsState(data);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    loadEmailSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Şifre boş değilse ayarlara dahil et
      const settingsToSave = {
        ...emailSettings,
        ...(emailSettings.pass && { pass: emailSettings.pass }),
      };

      await setEmailSettings(settingsToSave);
      alert("Email ayarları başarıyla kaydedildi!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteEmailSettings();
      setEmailSettingsState({
        server: "",
        port: "",
        user: "",
        pass: "",
        name: "",
        recipients: "",
      });
      alert("Email ayarları başarıyla silindi!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
    onClose();
  };

  return (
    <>
      <VStack spacing={6} align="stretch">
        <FormControl id="email-settings">
          <FormLabel>Email Ayarları</FormLabel>
          <VStack spacing={3}>
            <FormControl>
              <FormLabel>Görünür İsim</FormLabel>
              <Input
                value={emailSettings.name}
                onChange={(e) =>
                  setEmailSettingsState({
                    ...emailSettings,
                    name: e.target.value,
                  })
                }
                placeholder="Görünür İsim"
                variant="filled"
                focusBorderColor="purple.500"
                autoComplete="off"
              />
              <FormHelperText color="gray.500">
                Mailin alıcıları kimden geldğini bilmesi için verilen isim.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Mail Sunucusu</FormLabel>
              <Input
                value={emailSettings.server}
                onChange={(e) =>
                  setEmailSettingsState({
                    ...emailSettings,
                    server: e.target.value,
                  })
                }
                placeholder="Mail Sunucusu"
                variant="filled"
                focusBorderColor="purple.500"
                autoComplete="off"
              />
              <FormHelperText color="gray.500">
                SMTP Server olarak da geçer.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Port</FormLabel>
              <Input
                value={emailSettings.port}
                onChange={(e) =>
                  setEmailSettingsState({
                    ...emailSettings,
                    port: e.target.value,
                  })
                }
                placeholder="Port"
                variant="filled"
                focusBorderColor="purple.500"
                autoComplete="off"
              />
              <FormHelperText color="gray.500">
                SSL aktifse 465 aktif değilse 587 portları olur.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Mail Kullanıcı Adı</FormLabel>
              <Input
                value={emailSettings.user}
                onChange={(e) =>
                  setEmailSettingsState({
                    ...emailSettings,
                    user: e.target.value,
                  })
                }
                placeholder="Mail Kullanıcı Adı"
                variant="filled"
                focusBorderColor="purple.500"
                autoComplete="username"
              />
              <FormHelperText color="gray.500">
                Mail adresi mail servisi gmail'e göre ayarlanmıştır.{" "}
                <b>gmail</b> harici gönderim için geliştirici ile iletişime
                geçiniz.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Yeni Şifre</FormLabel>
              <Input
                value="" // Mevcut şifreyi göstermiyoruz
                onChange={(e) =>
                  setEmailSettingsState({
                    ...emailSettings,
                    pass: e.target.value, // Yeni şifreyi ayarla
                  })
                }
                placeholder="Yeni Şifre"
                type="password"
                variant="filled"
                focusBorderColor="purple.500"
                autoComplete="new-password"
              />
              <FormHelperText color="gray.500">
                Yalnızca yeni bir şifre girerseniz güncellenecektir.Şifre
                kayıtlıdır. Güvenlik amaclı ekranda gösterilmemektedir.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Alıcılar</FormLabel>
              <Input
                value={emailSettings.recipients}
                onChange={(e) =>
                  setEmailSettingsState({
                    ...emailSettings,
                    recipients: e.target.value,
                  })
                }
                placeholder="Alıcılar (Virgülle ayırarak giriniz)"
                variant="filled"
                focusBorderColor="purple.500"
                autoComplete="off"
              />
              <FormHelperText color="gray.500">
                Alıcıları virgülle ayırarak yazınız.
              </FormHelperText>
            </FormControl>
            <ButtonGroup variant={"outline"}>
              <Button
                colorScheme="purple"
                onClick={handleSave}
                isLoading={loading}
              >
                Kaydet
              </Button>
              <Button colorScheme="red" onClick={onOpen} isLoading={loading}>
                Sil
              </Button>
            </ButtonGroup>
            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </FormControl>

        {/* AlertDialog for confirmation */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Silme Onayı
              </AlertDialogHeader>

              <AlertDialogBody>
                Email ayarlarını silmek istediğinizden emin misiniz? Bu işlem
                geri alınamaz.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  İptal
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Sil
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </>
  );
};

const EmailSendTest = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const headingSize = useBreakpointValue({ base: "md", md: "lg" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });

  const sendTestEmail = async () => {
    if (!isValidEmail(to)) {
      setError("Geçersiz e-posta adresi.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, text }),
      });

      if (!response.ok) {
        // Yanıtın JSON olup olmadığını kontrol edin
        const result = await response.json();
        throw new Error(result.error || "E-posta gönderilirken hata oluştu.");
      }

      const result = await response.json();
      setSuccess(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} borderRadius="lg" boxShadow="md" maxW="full">
      <VStack spacing={4} align="stretch">
        <FormControl id="to-email">
          <FormLabel>Alıcı E-posta Adresi</FormLabel>
          <Input
            placeholder="example@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            variant="filled"
            focusBorderColor="purple.500"
          />
          <FormHelperText color="gray.500">
            Gönderici Email Ayaları sekmesinde ki kullanıcıdır.Alıcılar virgülle
            boşluksuz yazılabilir.
          </FormHelperText>
        </FormControl>
        <FormControl id="email-subject">
          <FormLabel>Konu</FormLabel>
          <Input
            placeholder="E-posta konusu"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            variant="filled"
            focusBorderColor="purple.500"
          />
          <FormHelperText color="gray.500">Mail Konusu</FormHelperText>
        </FormControl>
        <FormControl id="email-body">
          <FormLabel>Mesaj</FormLabel>
          <Input
            placeholder="E-posta içeriği"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="filled"
            focusBorderColor="purple.500"
          />
           <FormHelperText color="gray.500">
           Mail Mesajı
          </FormHelperText>
        </FormControl>
        <Button
          colorScheme="purple"
          variant={"outline"}
          onClick={sendTestEmail}
          isLoading={loading}
          size="lg"
        >
          {loading ? <Spinner size="sm" /> : "E-Posta Gönder"}
        </Button>
        {success && (
          <Alert status="success">
            <AlertIcon />
            {success}
          </Alert>
        )}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default EmailTab;
