import React from "react";
import {
  Flex,
  HStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  VStack,
  Text,
  Avatar,
  Box,
} from "@chakra-ui/react";
import { useAuth } from "../../../contexts/AuthContext";
import Link from "next/link";
import { adminBasePath } from "../../../constants/menuItems";
import Logo from "../../../components/Logo";
import ThemeSwitcher from "../../../components/ThemeSwitcher";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const bg = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  const handleLogout = () => {
    setUser(null);  // Çıkış işlemi burada gerçekleşiyor
  };

  return (
    <Flex
      boxShadow="sm"
      border="0 solid #e5e7eb"
      justifyContent="space-between"
      shadow="md"
      p={2}
      zIndex={15}
      width="100%"
      alignItems="center"
      bg={bg}
    >
      <Logo position="header" src="sportstylecomtr" isLink href={adminBasePath} />
      <HStack spacing={2}>
        <ThemeSwitcher />
        <Menu>
          <MenuButton as={Button} size="sm" variant="ghost">
            <Avatar size="sm" name={user?.name || "User"} src={user?.avatarURL || ""} />
          </MenuButton>
          <MenuList bg={menuBg} borderColor={useColorModeValue("gray.100", "gray.700")} boxShadow="lg">
            <MenuItem as={Link} href="/profile">
              <VStack align="start">
                <Text fontWeight="500">{user?.name || "User Name"}</Text>
                <Text fontSize="sm" color="gray.500">{user?.email || "user@example.com"}</Text>
              </VStack>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Text fontWeight="500">Çıkış Yap</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Navbar;
