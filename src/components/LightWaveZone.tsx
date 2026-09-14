"use client";

import { useRef, type ReactNode } from "react";
import GradientBlobs from "./GradientBlobs";

export default function LightWaveZone({ children }: { children: ReactNode }) {
  const zoneRef = useRef<HTMLDivElement>(null);

  return (
    <div className="light-wave-zone" ref={zoneRef}>
      <GradientBlobs targetRef={zoneRef} variant="light" />
      <div className="light-wave-content">{children}</div>
    </div>
  );
}
