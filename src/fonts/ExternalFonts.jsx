import React from "react";

function ExternalFonts() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Roboto+Condensed:wght@100;300;400;500;700;900&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

export default ExternalFonts;
