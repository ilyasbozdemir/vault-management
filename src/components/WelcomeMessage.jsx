import { Box, Text, Avatar, Flex, Icon, VStack, useColorModeValue } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { FaSun, FaMoon, FaCloudSun, FaCloudMoon } from "react-icons/fa";

// Rastgele motivasyon cümleleri listesi
const motivationalQuotes = [
  "Başarının sırrı, sürekli çalışmaktır.",
  "Her gün yeni bir başlangıçtır.",
  "Hayallerine ulaşmak için asla pes etme.",
  "Zorluklar seni güçlendirir.",
  "Başarı, cesaret ve kararlılıkla gelir.",
  "Pozitif düşünce, olumlu sonuçlar doğurur.",
  "Başarı, küçük adımlarla gelir.",
  "Kendine inan, başarı seninle.",
  "Motivasyon, başarıya giden yoldur.",
  "Her zorluk, bir fırsat sunar."
];

// Rastgele cümle seçme fonksiyonu
const getRandomQuote = () => {
  const index = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[index];
};

const WelcomeMessage = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { message: "Günaydın", icon: FaSun };
    } else if (hour >= 12 && hour < 18) {
      return { message: "Tünaydın", icon: FaCloudSun };
    } else if (hour >= 18 && hour < 22) {
      return { message: "İyi Akşamlar", icon: FaCloudMoon };
    } else {
      return { message: "İyi Geceler", icon: FaMoon };
    }
  };

  const { message, icon } = getGreeting();

  // Tema için renk ayarları
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("purple.500", "purple.300");

  return (
    <Box
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      bg={bg}
      maxWidth="400px"
      mx="auto"
      mt={6}
      textAlign="center"
      color={textColor}
    >
      <Flex alignItems="center" justifyContent="center" mb={4}>
        <Avatar src={user?.avatarURL} name={user.name} size="xl" mr={4} />
        <VStack align="start">
          <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
            {message}, {user.name || "Kullanıcı"}!
          </Text>
          <Flex alignItems="center">
            <Icon as={icon} w={6} h={6} mr={2} color={accentColor} />
            <Text fontSize="md" color={accentColor}>{message}</Text>
          </Flex>
        </VStack>
      </Flex>
      <Text fontSize="md" mt={4} color="gray.500" fontStyle="italic">
        "{getRandomQuote()}"
      </Text>
      <Box mt={4}>
        <Text fontSize="sm">Rol: {user.role}</Text>
        <Text fontSize="sm">Email: {user.email}</Text>
      </Box>
    </Box>
  );
};

export default WelcomeMessage;
