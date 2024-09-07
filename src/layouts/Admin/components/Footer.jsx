import { useState, useEffect } from "react";
import { Flex, Text, Link as ChakraLink, Icon, Box, HStack, Circle, Button } from "@chakra-ui/react";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube, FaPinterest, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import CommandMenu from "../../../components/CommandMenu";
import ThemeToggle from "../../../components/ThemeToggle";
import { site } from "../../../constants/site";

const socialIcons = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  pinterest: FaPinterest,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  github: FaGithub,
};

function Footer() {
  const currentYear = new Date().getFullYear();
  const [systemStatus, setSystemStatus] = useState({ status: "", indicator: "", link: "" });

  useEffect(() => {
    fetch("/api/status")
      .then((response) => response.json())
      .then((data) => setSystemStatus(data));
  }, []);

  const getIndicatorColor = (indicator) => {
    switch (indicator) {
      case "normal":
        return "blue.500";
      case "warning":
        return "yellow.500";
      case "error":
        return "red.500";
      default:
        return "gray.500";
    }
  };

  return (
    <Flex
      as="footer"
      w="full"
      p={4}
      justifyContent="space-between"
      alignItems="center"
      borderTop="1px solid"
      borderColor="gray.200"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Flex alignItems="center" mb={{ base: 2, md: 0 }}>
        <Text color="gray.600" mr={2}>
          © {currentYear}
        </Text>
        <HStack spacing={2} alignItems="center">
          <Circle size="10px" bg={getIndicatorColor(systemStatus.indicator)} />
          <Button
            as={Link}
            href={systemStatus.link}
            rel={'noopenner'}
            target="_blank"
            colorScheme="blue"
            variant="link"
          >
            {systemStatus.status}
          </Button>
        </HStack>
      </Flex>
      <Flex
        alignItems="center"
        flexWrap="wrap"
        justifyContent={{ base: "center", md: "flex-end" }}
        gap={2}
      >
        {site.sosyalMediaLinks
          .filter((link) => link.isActive)
          .map((link) => {
            const IconComponent = socialIcons[link.label];
            return (
              <ChakraLink
                as={Link}
                href={link.link}
                isExternal
                color="gray.600"
                ml={2}
                key={link.id}
              >
                <Icon as={IconComponent} boxSize={5} />
              </ChakraLink>
            );
          })}
        <ThemeToggle />
        <CommandMenu />
      </Flex>
    </Flex>
  );
}

export default Footer;
