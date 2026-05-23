"use client";

import { useState, type CSSProperties } from "react";

// Available image framing modes for record cards.
//   face    - portrait/headshot, anchors focal point near the top so faces
//             always land in the visible middle band of the card.
//   center  - centered cover (used for action shots & wide compositions).
//   contain - shows the entire image inside the frame (logos, badges).
export type RecordImageFit = "face" | "center" | "contain";

const FIT_STYLES: Record<RecordImageFit, CSSProperties> = {
  face:    { objectFit: "cover",   objectPosition: "50% 22%" },
  center:  { objectFit: "cover",   objectPosition: "50% 50%" },
  contain: { objectFit: "contain", objectPosition: "50% 50%" },
};

// Small client island used inside the otherwise-server Records page.
// Handles graceful fallback to the gradient background if the image
// is missing or fails to load.
export default function RecordImage({
  src,
  alt,
  fit = "face",
}: {
  src: string;
  alt: string;
  fit?: RecordImageFit;
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
      style={FIT_STYLES[fit]}
      className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
    />
  );
}
