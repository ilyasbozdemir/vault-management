// components/ThemeSwitcher.js

import React from "react";
import { Button, IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ThemeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      aria-label="Toggle Theme"
      variant="outline"
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      zIndex="9999"
    >
    </IconButton>
  );
};

export default ThemeSwitcher;
