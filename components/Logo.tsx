import React from "react";
import LogoImg from "../assets/logo.png";

type LogoProps = {
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
  return (
    <img
      src={LogoImg}
      alt="Readytowrite Hub Logo"
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;
