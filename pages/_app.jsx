import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import "../styles/globals.css";
import theme from "../src/theme";
import { AuthProvider } from "../src/contexts/AuthContext";
const AdminLayout = dynamic(() =>
  import("../src/layouts/Admin/layout").then((mod) => mod.default)
);

function MyApp({ Component, pageProps, statusCode }) {
  const router = useRouter();

  const isLoginPage = router.pathname === "/login";

  const Layout = isLoginPage ? React.Fragment : AdminLayout;

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <AuthProvider>
      <Layout>
            <Component {...pageProps} />
          </Layout>
      </AuthProvider>
    </ChakraProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { Component, ctx } = appContext;
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const { res, err } = ctx;
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;

  return { pageProps, statusCode };
};

export default MyApp;
