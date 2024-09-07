import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  HStack,
  useColorModeValue,
  Link as ChakraLink,
  Center,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import Head from "next/head";

const LicenseInfo = () => {
  const [packageData, setPackageData] = useState(null);
  const [error, setError] = useState(null);
  const [licenseData, setLicenseData] = useState(null);
  const [isValidDomain, setIsValidDomain] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await fetch("/api/package");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPackageData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPackageData();
  }, []);

  useEffect(() => {
    const fetchLicenseData = async () => {
      if (packageData?.licenseInfo.licenseDataUrl) {
        try {
          const response = await fetch(packageData.licenseInfo.licenseDataUrl);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          setLicenseData(data[0]);
          validateDomain(data[0].licenses[0].domain);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    if (packageData) {
      fetchLicenseData();
    }
  }, [packageData]);

  const validateDomain = (allowedDomain) => {
    const currentDomain = window.location.hostname;
    if (currentDomain === allowedDomain) {
      setIsValidDomain(true);
    }
  };

  const getContactUrl = () => {
    const url = new URL(packageData.licenseInfo.licenseCheckUrl);
    return `${url.protocol}//${url.hostname}`;
  };

  const cardBg = useColorModeValue("white", "gray.700");

  if (error) {
    return (
      <Center minHeight="100vh">
        <Alert status="error">
          <AlertIcon />
          Error: {error}
        </Alert>
      </Center>
    );
  }

  if (!packageData || !licenseData) {
    return (
      <Center minHeight="100vh">
        <HStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading license information...</Text>
        </HStack>
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>License Information - SportStyle</title>
      </Head>
      <Box p={8} maxW="800px" mx="auto" borderWidth="1px" borderRadius="lg" boxShadow="lg">
        <Alert status={isValidDomain ? "success" : "error"} mb={4}>
          <AlertIcon />
          {isValidDomain
            ? "This software is licensed for this domain."
            : "This software is not licensed for this domain. However, it is allowed during development."}
        </Alert>

        <Heading as="h3" size="lg" mt={4} mb={4} textAlign="center">
          License Information
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 1 }} spacing={5}>
          {licenseData.licenses.map((license, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={5}
              bg={cardBg}
              shadow="md"
              _hover={{ shadow: "lg" }}
              maxW="full"
            >
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {license.licenseType.toUpperCase()} License
              </Text>
              <Text>
                <strong>Licensee:</strong> {license.licensee}
              </Text>
              <Text>
                <strong>License Code:</strong> {license.licenseCode}
              </Text>
              <Text>
                <strong>Issuer:</strong> {license.licenseIssuer}
              </Text>
              <Text>
                <strong>Domain:</strong> {license.domain}
              </Text>
              <Text>
                <strong>Expiration:</strong> {license.expirationDate}
              </Text>
              <Text>
                <strong>Code License:</strong>{" "}
                {license.codeLicenses.map((codeLicense, index) => (
                  <ChakraLink key={index} href={codeLicense.url} isExternal>
                    <Badge colorScheme="purple" mr={1}>
                      {codeLicense.type}
                    </Badge>
                  </ChakraLink>
                ))}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Divider my={4} />

        <Heading as="h3" size="lg" mt={4} mb={4} textAlign="center">
          Developer Information
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={5}
            bg={cardBg}
            shadow="md"
            _hover={{ shadow: "lg" }}
            maxW="full"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Developer
            </Text>
            <Text>{licenseData.licenses[0].licenseIssuer}</Text>
          </Box>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={5}
            bg={cardBg}
            shadow="md"
            _hover={{ shadow: "lg" }}
            maxW="full"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Licensee
            </Text>
            <Text>{licenseData.licenses[0].licensee}</Text>
          </Box>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={5}
            bg={cardBg}
            shadow="md"
            _hover={{ shadow: "lg" }}
            maxW="full"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Contact
            </Text>
            <ChakraLink href={getContactUrl()} isExternal>
              {getContactUrl()}
            </ChakraLink>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default LicenseInfo;
