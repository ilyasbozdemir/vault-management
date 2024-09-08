import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../src/contexts/AuthContext";
import Logo from "../src/components/Logo";
import Head from "next/head";
import { auth } from "../firebase";
import { getUserByEmail } from "../src/services/firebase/userService";
import { getAppSettings } from "../src/services/firebase/settingsService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = await getUserByEmail(email);
      setUser({
        uid: user.uid,
        email: user.email,
        name: userData.name || "",
        avatarURL: userData.avatarURL || "",
        role: userData.role || "user",
      });

      toast({
        title: "Başarıyla giriş yapıldı.",
        description: "Dashboard'a yönlendiriliyorsunuz...",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.replace("/");
    } catch (error) {
      toast({
        title: "Giriş hatası.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const boxBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("purple.500", "purple.300");

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
    <>
      <Head>
        <title>
          {appSettings ? `${appSettings.appName} • Giriş Yap` : "Giriş Yap"}
        </title>
      </Head>
      <Center h="100vh">
        <Box
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bg={boxBg}
          w={{ base: "full", sm: "300px", md: "500px" }}
        >
          <Center mb={6}>
            <Logo isLink={false} platform='login' />
          </Center>
          <Heading
            as="h1"
            size="lg"
            textAlign="center"
            color={headingColor}
            mb={6}
          >
            Giriş Yap
          </Heading>
          <form onSubmit={handleEmailLogin}>
            <VStack spacing={4} align="stretch">
              <FormControl id="login-email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email adresinizi girin"
                  focusBorderColor="purple.500"
                  autoComplete="username"
                />
              </FormControl>
              <FormControl id="login-password">
                <FormLabel>Şifre</FormLabel>
                <Input
                  type="password"
                  name="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  focusBorderColor="purple.500"
                  autoComplete="current-password"
                />
              </FormControl>
              <Button colorScheme="purple" width="full" type="submit">
                Giriş Yap
              </Button>
            </VStack>
          </form>
        </Box>
      </Center>
    </>
  );
};

export default LoginPage;
