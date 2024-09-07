import { Box, Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { getIcon } from "../utils/react-icons";

const HorizontalMenu = ({ menuItems }) => {
  const router = useRouter();
  const { pathname } = router;
  const menuRef = useRef(null);

  const isActive = (href) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  const cardBg = useColorModeValue("gray.100", "gray.700");
  const menuctiveBg = useColorModeValue("gray.300", "gray.600");
  const menuBg = useColorModeValue("gray.100", "gray.700");
  const menuHoverBg = useColorModeValue("gray.300", "gray.600");

  const scrollToActive = () => {
    if (menuRef.current) {
      const activeElement = menuRef.current.querySelector(".active");
      if (activeElement) {
        const container = menuRef.current;
        const containerWidth = container.offsetWidth;
        const activeElementWidth = activeElement.offsetWidth;
        const activeElementOffset = activeElement.offsetLeft;
        const scrollLeft = Math.max(
          0,
          activeElementOffset - containerWidth / 2 + activeElementWidth / 2
        );
        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    scrollToActive(); // Scroll to active element on pathname change
    window.addEventListener("resize", scrollToActive); // Re-calculate on resize

    return () => {
      window.removeEventListener("resize", scrollToActive); // Clean up the event listener
    };
  }, [pathname]);

  return (
    <Box width="100%" px={4} py={2} boxShadow="md" bg={cardBg}>
      <Box
        overflowX="auto"
        whiteSpace="nowrap"
        ref={menuRef}
        css={css`
          &::-webkit-scrollbar {
            display: none;
          }
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        `}
      >
        <Flex
          justifyContent={{
            base: "start",
            md: "center",
          }}
        >
          {menuItems.map((item) => (
            <Link key={item.id + 22} href={item.href}>
              <Flex
                className={isActive(item.href) ? "active" : ""}
                alignItems="center"
                px={4}
                py={2}
                mr={4}
                bg={isActive(item.href) ? menuctiveBg : menuBg}
                _hover={{ textDecoration: "none", bg: menuHoverBg }}
                borderRadius="md"
              >
                <Icon
                  as={getIcon(item.logoSrc)}
                  color={item.iconColor}
                  mr={2}
                />
                {item.title}
              </Flex>
            </Link>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default HorizontalMenu;
