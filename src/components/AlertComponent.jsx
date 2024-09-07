import React from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box, Button } from "@chakra-ui/react";

const AlertComponent = ({ status, title, description, onClose, onConfirm }) => {
  return (
    <Box mb={4}>
      <Alert status={status}>
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>{title}</AlertTitle>
          {description && <AlertDescription display="block">{description}</AlertDescription>}
        </Box>
        <CloseButton onClick={onClose} position="absolute" right="8px" top="8px" />
      </Alert>
      {onConfirm && (
        <Box mt={2}>
          <Button colorScheme="red" onClick={onConfirm}>
            Onayla
          </Button>
          <Button ml={2} onClick={onClose}>
            İptal
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AlertComponent;
