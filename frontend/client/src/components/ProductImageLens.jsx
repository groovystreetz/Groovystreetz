"use client";
import { useState } from "react";
import { Lens } from "./ui/lens";
import {motion}  from "framer-motion";
import { cn } from "../lib/utils";

export function ProductImageLens({ 
  src, 
  alt, 
  className = "",
  zoomFactor = 2,
  lensSize = 200 
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <Lens 
        hovering={hovering} 
        setHovering={setHovering}
        zoomFactor={zoomFactor}
        lensSize={lensSize}
      >
        <img
          src={src}
          alt={alt}
          className="w-full rounded-lg object-cover"
          style={{ display: "block", width: "100%" }}
        />
      </Lens>
      
      {/* Optional overlay effect when hovering */}
      <motion.div
        animate={{
          opacity: hovering ? 0.1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black rounded-lg pointer-events-none"
      />
    </div>
  );
}
