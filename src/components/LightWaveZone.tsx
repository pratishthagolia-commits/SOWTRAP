"use client";

import { useRef, type ReactNode } from "react";
import GradientBlobs from "./GradientBlobs";
import useIsMobile from "@/lib/useIsMobile";

export default function LightWaveZone({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const zoneRef = useRef<HTMLDivElement>(null);

  return (
    <div className="light-wave-zone" ref={zoneRef}>
      {!isMobile && <GradientBlobs targetRef={zoneRef} variant="light" />}
      <div className="light-wave-content">{children}</div>
    </div>
  );
}
