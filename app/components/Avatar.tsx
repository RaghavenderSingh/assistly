import { rings } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";
import React from "react";

function Avatar({ seed, className }: { seed?: string; className?: string }) {
  const avatar = createAvatar(rings, {
    seed,
  });
  const svg = avatar.toString();
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64"
  )}`;
  return (
    <Image
      src={dataUrl}
      alt="User Avatar"
      width={100}
      height={100}
      className={className}
    />
  );
}

export default Avatar;
