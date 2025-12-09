import React from 'react';
import LogoImage from "../assets/LogoJire.png"
export default function Logo({ className = ""}) {
  return (
    <img 
      src={LogoImage}
      alt="Salão Jiré" 
      className={`w-auto object-contain ${className}`}
    />
  );
}