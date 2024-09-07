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
  Wrap,
  WrapItem,
  Flex,
  useColorModeValue,
  Tooltip,
  Image,
  Icon,
  Collapse,
  Button,
  useDisclosure,
  Center,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { FaGithub, FaNpm } from "react-icons/fa";
import Link from "next/link";

const PackageInfo = () => {
  const [packageData, setPackageData] = useState(null);
  const [error, setError] = useState(null);

  const { isOpen: areDepsOpen, onToggle: toggleDeps } = useDisclosure();
  const { isOpen: areDevDepsOpen, onToggle: toggleDevDeps } = useDisclosure();

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

  if (!packageData) {
    return (
      <Center minHeight="100vh">
        <HStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading package information...</Text>
        </HStack>
      </Center>
    );
  }

  const createNpmLink = (dep, version) =>
    `https://www.npmjs.com/package/${dep}/v/${version.replace("^", "")}`;

  const cardBg = useColorModeValue("white", "gray.700");
  const cardColor = useColorModeValue("gray.400", "white");
  const bg = useColorModeValue("gray.200", "gray.700");

  const Card = ({ dep, version }) => (
    <WrapItem flexBasis={{ base: "100%", md: "48%" }}>
      <Tooltip label={dep} hasArrow>
        <Flex
          direction="column"
          align="center"
          bg={cardBg}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          width="100%"
          height="150px"
          overflow="hidden"
          position="relative"
          _hover={{ shadow: "lg" }}
        >
          <Icon
            as={FaNpm}
            position="absolute"
            top="1rem"
            left="1rem"
            boxSize={6}
            color="red.500"
          />
          <Text
            textAlign="center"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxWidth="180px"
            translate="no"
            mt={10}
          >
            {dep}
          </Text>
          <Flex
            as={Link}
            href={createNpmLink(dep, version)}
            isExternal
            align="center"
            mt={2}
            borderRadius="md"
            textDecoration={"none"}
            target="_blank"
            rel="noopener"
          >
            <Flex
              align="center"
              bg="green.500"
              color="white"
              borderRadius="md"
              px={2}
              py={1}
              ml={2}
            >
              <Text fontSize="sm" fontWeight="bold">
                {version.replace("^", "")}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Tooltip>
    </WrapItem>
  );

  return (
    <Box p={8} maxW="800px" mx="auto" borderWidth="1px" borderRadius="lg" boxShadow="lg">
      <Alert status="info" mb={4}>
        <AlertIcon />
        The project relies on the following dependencies and devDependencies:
      </Alert>

      <Flex
        direction="column"
        align="center"
        bg={cardBg}
        p={6}
        shadow="lg"
        borderWidth="1px"
        borderRadius="lg"
        width="100%"
        mb={8}
        _hover={{ shadow: "xl" }}
        position="relative"
      >
        <ChakraLink href={packageData.repository.url} isExternal>
          <Icon
            as={FaGithub}
            boxSize={6}
            color={cardColor}
            position="absolute"
            top="1rem"
            right="1rem"
          />
        </ChakraLink>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={bg}
          p={2}
          borderRadius="full"
          boxSize="80px"
        >
          <Image
            src={packageData.repository.logoUrl}
            alt="Project Logo"
            boxSize="80px"
            borderRadius="full"
            objectFit="cover"
          />
        </Box>

        <Flex
          gap={3}
          textAlign="center"
          direction={"column"}
          justifyContent={"center"}
          align="center"
        >
          <HStack justify="center" textAlign={"center"}>
            <Text fontSize="2xl" fontWeight="semibold" translate="no">
              {packageData.name}
            </Text>
            {packageData.private && (
              <Box top="1rem" right="1rem">
                <LockIcon boxSize={4} color={cardColor} />
              </Box>
            )}
          </HStack>
          <Text fontSize="lg" color={cardColor}>
            v{packageData.version}
          </Text>
          {packageData.description && (
            <Text fontSize="md" color={cardColor} px={4}>
              {packageData.description}
            </Text>
          )}
        </Flex>
      </Flex>

      <Divider my={4} />

      <Button onClick={toggleDeps} mb={4} width="100%" variant="outline">
        {areDepsOpen ? "Hide Dependencies" : "Show Dependencies"}
      </Button>

      <Divider my={4} />

      <Button onClick={toggleDevDeps} mb={4} width="100%" variant="outline">
        {areDevDepsOpen ? "Hide DevDependencies" : "Show DevDependencies"}
      </Button>
      <Collapse in={areDepsOpen}>
        <Heading as="h3" size="lg" mt={4} mb={2}>
          Dependencies
        </Heading>
        {packageData.dependencies ? (
          <Wrap spacing="20px">
            {Object.keys(packageData.dependencies).map((dep) => (
              <Card
                key={dep}
                dep={dep}
                version={packageData.dependencies[dep]}
              />
            ))}
          </Wrap>
        ) : (
          <Text>No dependencies found.</Text>
        )}
      </Collapse>

      <Collapse in={areDevDepsOpen}>
        <Heading as="h3" size="lg" mt={4} mb={2}>
          DevDependencies
        </Heading>
        {packageData.devDependencies ? (
          <Wrap spacing="20px">
            {Object.keys(packageData.devDependencies).map((dep) => (
              <Card
                key={dep}
                dep={dep}
                version={packageData.devDependencies[dep]}
              />
            ))}
          </Wrap>
        ) : (
          <Text>No devDependencies found.</Text>
        )}
      </Collapse>
    </Box>
  );
};

export default PackageInfo;
