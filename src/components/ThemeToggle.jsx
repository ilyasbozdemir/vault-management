import { useColorMode, Flex, Box, useColorModeValue } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const sunColor = useColorModeValue("gray.800", "white");
  const moonColor = useColorModeValue("white", "gray.800");
  const bgColor = useColorModeValue("gray.200", "gray.600");
  const switchBgColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Flex alignItems="center" justifyContent="center">
      <Box
        as="button"
        onClick={toggleColorMode}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bg={bgColor}
        borderRadius="full"
        p="2px"
        w="60px"
        h="30px"
        position="relative"
      >
        <Box
          as={FaSun}
          color={sunColor}
          position="absolute"
          left="5px"
          top="50%"
          transform="translateY(-50%)"
          opacity={colorMode === "light" ? 1 : 0}
          transition="opacity 0.2s"
          zIndex={1}
        />
        <MotionBox
          initial={{ x: colorMode === "light" ? 0 : 30 }}
          animate={{ x: colorMode === "light" ? 0 : 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="30px"
          height="30px"
          bg={switchBgColor}
          borderRadius="full"
          position="relative"
          zIndex={2}
        >
          {colorMode === "light" ? (
            <Box as={FaMoon} color={moonColor} boxSize="20px" />
          ) : (
            <Box as={FaSun} color={sunColor} boxSize="20px" />
          )}
        </MotionBox>
        <Box
          as={FaMoon}
          color={moonColor}
          position="absolute"
          right="5px"
          top="50%"
          transform="translateY(-50%)"
          opacity={colorMode === "dark" ? 1 : 0}
          transition="opacity 0.2s"
          zIndex={1}
        />
      </Box>
    </Flex>
  );
};

export default ThemeToggle;
