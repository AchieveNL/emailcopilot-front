import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {/* Colorful background blobs for rich modern depth */}
      {/* Purple blob positioned top-left */}
      <div
        className="absolute top-[20%] left-[-6%] w-[10vw] h-[10vw] md:w-[15vw] md:h-[15vw] rounded-full filter blur-[20px] animate-blob mix-blend-multiply"
        style={{ backgroundColor: "#F5F3FF" }}
      />

      {/* Blue blob at bottom-right */}
      <div
        className="absolute top-[25%] right-[-6%] w-[10vw] h-[10vw] md:w-[15vw] md:h-[15vw] rounded-full filter blur-[20px] animate-blob animation-delay-2000 mix-blend-multiply"
        style={{ backgroundColor: "#EFF6FF" }}
      />

      {/* Gray blob in the center-right */}
      <div
        className="absolute bottom-[-15%] left-[30%] w-[10vw] h-[10vw] md:w-[15vw] md:h-[15vw] rounded-full filter blur-[60px] animate-blob animation-delay-4000 mix-blend-multiply"
        style={{ backgroundColor: "#E2E8F0" }}
      />
    </div>
  );
}

