import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  useToast,
  Spinner,
  Center,
  FormControl,
  FormLabel,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../src/contexts/AuthContext";
import Cookies from "js-cookie";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { updateUserProfile } from "../src/services/firebase/userService";
import Head from "next/head";
import RequireAuth from "../src/components/RequireAuth";

const Profile = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const toast = useToast();
  const { user, setUser } = useAuth();

  const { email, name: userName, avatarURL: userAvatarURL, role } = user || {};

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name || "");
            setAvatarURL(userData.avatarURL || "");
          } else {
            console.error("Kullanıcı verisi bulunamadı.");
          }
        } catch (error) {
          console.error("Kullanıcı verileri alınırken bir hata oluştu:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Kullanıcı verisi mevcut değil.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Yeni şifreler eşleşmiyor.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUpdating(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        "/api/update-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Şifre başarıyla güncellendi.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Şifre güncellenirken hata oluştu:", error);
      toast({
        title: "Şifre güncellenemedi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateUserProfile(user.uid, { name, avatarURL });
      setUser((prev) => ({ ...prev, name, avatarURL }));

      toast({
        title: "Profil başarıyla güncellendi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Profil güncellenirken hata oluştu:", error);
      toast({
        title: "Profil güncellenemedi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }

    toast({
      title: "Çıkış yapıldı.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  return (
    <RequireAuth>
      <Head>
        <title>Profil • rsrichsoul</title>
      </Head>
      <Box
        p={8}
        maxW="500px"
        mx="auto"
        mt={10}
        boxShadow="lg"
        borderRadius="md"
      >
        <Heading mb={6} textAlign="center" color="purple.600">
          Profil Bilgileri
        </Heading>
        <VStack spacing={5} align="stretch">
          {userAvatarURL && (
            <Box textAlign="center">
              <Avatar
                src={userAvatarURL}
                alt="Avatar"
                boxSize="100px"
                objectFit="cover"
                borderRadius="full"
                mb={4}
              />
            </Box>
          )}
          {userName && (
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              Merhaba, {userName}!
            </Text>
          )}
          {editing ? (
            <>
              <FormControl id="name" isRequired>
                <FormLabel>Ad</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınızı girin"
                  focusBorderColor="purple.500"
                />
              </FormControl>
              <FormControl id="avatarURL" isRequired>
                <FormLabel>Avatar URL</FormLabel>
                <Input
                  value={avatarURL}
                  onChange={(e) => setAvatarURL(e.target.value)}
                  placeholder="Avatar URL'nizi girin"
                  focusBorderColor="purple.500"
                />
              </FormControl>
              <Button
                onClick={handleProfileUpdate}
                colorScheme="teal"
                isLoading={isUpdating}
                width="full"
              >
                Profil Güncelle
              </Button>
            </>
          ) : (
            <></>
          )}
          <FormControl id="current-password">
            <FormLabel>Mevcut Şifre</FormLabel>
            <Input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Mevcut Şifre"
              type="password"
              focusBorderColor="purple.500"
            />
          </FormControl>
          <FormControl id="new-password">
            <FormLabel>Yeni Şifre</FormLabel>
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni Şifre"
              type="password"
              focusBorderColor="purple.500"
            />
          </FormControl>
          <FormControl id="confirm-password">
            <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni Şifre (Tekrar)"
              type="password"
              focusBorderColor="purple.500"
            />
          </FormControl>
          <Button
            onClick={handleSave}
            colorScheme="purple"
            isLoading={isUpdating}
            isDisabled={
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword
            }
            width="full"
          >
            Şifreyi Güncelle
          </Button>
          <Button onClick={handleLogout} colorScheme="red" width="full" mt={4}>
            Çıkış Yap
          </Button>
        </VStack>
      </Box>
    </RequireAuth>
  );
};

export default Profile;
