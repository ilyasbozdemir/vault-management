import Link from "next/link";
import React from "react";
import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import LogoImage from "./LogoImage";

function Logo({
  locale = "tr",
  position = "header",
  isLink = true,
  href = '/',
  rel = 'home',
  src = "",
}) {
  const cursor = isLink ? "pointer" : "default";

  // Cihaz platformuna göre boyut belirleme
  const platform = useBreakpointValue({ base: "mobile", md: "desktop" });

  const size = {
    header: {
      mobile: { h: 35, w: 125 },
      desktop: { h: 50, w: 50 },
    },
    footer: {
      mobile: { h: 75, w: 150 },
      desktop: { h: 100, w: 175 },
    },
    login: {
      mobile: { h: 100, w: 100 },
      desktop: { h: 150, w: 150 },
    },
  }[position][platform];

  const color = {
    header: useColorModeValue("black", "white"),
    footer: useColorModeValue("#fff", "#fff"),
    login: useColorModeValue("#fff", "#fff"),
  }[position];

  // Logo bileşeni
  const LogoContent = (
    <LogoImage size={size} cursor={cursor} color={color} />
  );

  // Eğer logo bir linkse
  return isLink ? (
    <Link href={href} rel={rel} locale={locale}>
      {LogoContent}
    </Link>
  ) : (
    LogoContent
  );
}

export default Logo;
