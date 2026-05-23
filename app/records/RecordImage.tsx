"use client";

import { useState } from "react";

// Small client island used inside the otherwise-server Records page.
// Handles graceful fallback to the gradient background if the image
// is missing or fails to load.
export default function RecordImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
}
