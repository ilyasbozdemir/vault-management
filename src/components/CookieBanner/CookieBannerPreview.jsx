import React from 'react';
import { Box, Checkbox, Button, VStack, HStack, Text } from '@chakra-ui/react';

const CookieBannerPreview = ({
  consentTitle,
  consentBody,
  acceptButtonText,
  rejectButtonText,
  customizeButtonText,
  showAcceptButton,
  showRejectButton,
  showCustomizeButton,
  categories,
}) => {
  return (
    <Box p={4} bg="purple.600" borderRadius="md" shadow="md" mb={6} color="white">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">{consentTitle || "This website uses cookies"}</Text>
        <Text>{consentBody || "We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners."}</Text>
        <HStack spacing={4} align="flex-start">
          <Checkbox isChecked isDisabled colorScheme="whiteAlpha">Necessary</Checkbox>
          {categories.preferences && (
            <Checkbox isChecked={categories.preferences} colorScheme="whiteAlpha">
              Preferences
            </Checkbox>
          )}
          {categories.statistics && (
            <Checkbox isChecked={categories.statistics} colorScheme="whiteAlpha">
              Statistics
            </Checkbox>
          )}
          {categories.marketing && (
            <Checkbox isChecked={categories.marketing} colorScheme="whiteAlpha">
              Marketing
            </Checkbox>
          )}
        </HStack>
        <HStack spacing={2} align="stretch">
          {showRejectButton && (
            <Button colorScheme="whiteAlpha" variant="outline" onClick={() => {}}>{rejectButtonText}</Button>
          )}
          {showCustomizeButton && (
            <Button colorScheme="blue" onClick={() => {}}>{customizeButtonText}</Button>
          )}
          {showAcceptButton && (
            <Button colorScheme="blue" onClick={() => {}}>{acceptButtonText}</Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default CookieBannerPreview;
