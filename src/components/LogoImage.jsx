import Image from 'next/image';
import React from 'react'

function LogoImage({ size, cursor, color }) {
  const src =
  color === "black"
    ? "/img/logo-dark.svg"
    : "/img/logo-light.svg";

return (
  <>
    <Image
      src={src}
      width={size.w}
      height={size.h}
      alt="logo"
    />
  </>
);
}

export default LogoImage