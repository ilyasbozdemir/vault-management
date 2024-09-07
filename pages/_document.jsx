import Document, { Html, Head, Main, NextScript } from "next/document";
import theme from "../src/theme";
import { ColorModeScript } from "@chakra-ui/react";
import ExternalFonts from "../src/fonts/ExternalFonts";
import React from "react";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "../src/utils/createEmotionCache";

const cache = createEmotionCache();
const { extractCritical } = createEmotionServer(cache);

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        <style
          data-emotion-css={styles.ids.join(" ")}
          dangerouslySetInnerHTML={{ __html: styles.css }}
        />,
      ],
    };
  }

  render() {
    return (
      <Html prefix="og: http://ogp.me/ns#">
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" href="/img/favicon.svg" type="image/svg+xml" />
          <meta name="robots" content="noindex, nofollow" />
          <meta httpEquiv="X-Robots-Tag" content="noindex, nofollow" />
          <link
            rel="icon"
            href="/img/favicon.png"
            type="image/png"
            sizes="16x16"
          />
          <link rel="apple-touch-icon" href="/img/favicon.svg" />

          <meta
            httpEquiv="Content-Type"
            content={`text/html; charset=${"utf-8"}`}
          />
          <meta name="revisit-after" content="1 days" />
          <link rel="icon" href="/favicon.png" type="image/png" />
          <meta name="theme-color" content="#6A45FF" />
          <ExternalFonts />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
