"use client";

import { useState } from "react";

interface ClientImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Image component with graceful error fallback.
 * If the image fails to load (e.g. file not found), it unmounts
 * so the CSS gradient background behind it shows through cleanly.
 */
export default function ClientImage({
  src,
  alt,
  className,
  style,
}: ClientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={
        className ?? "absolute inset-0 w-full h-full object-cover opacity-50"
      }
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
