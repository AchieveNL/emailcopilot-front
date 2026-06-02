import React from "react";

/*
 * AnimatedBackground - A fixed full-screen animated gradient background
 * Uses three blurred circles that gently morph and shift, creating a soft and
 * modern aesthetic that works behind all page content
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-white">
      {/* Purple blob positioned top-left: adds depth and warmth to the design */}
      <div 
        className="absolute top-[-5%] left-[-10%] w-[40vw] h-[40vw] rounded-full filter blur-[20px] opacity-80 animate-blob mix-blend-multiply"
        style={{ backgroundColor: "#F5F3FF" }}
      />
      
      {/* Blue blob at bottom-right: creates balance with the purple, delayed animation for layered effect */}
      <div 
        className="absolute bottom-[-10%] right-[-5%] w-[55vw] h-[55vw] rounded-full filter blur-[30px] opacity-90 animate-blob animation-delay-2000 mix-blend-multiply"
        style={{ backgroundColor: "#EFF6FF" }}
      />
      
      {/* Gray blob in the center-right: ties everything together, slowest animation for subtle movement */}
      <div 
        className="absolute top-[25%] right-[15%] w-[45vw] h-[45vw] rounded-full filter blur-[30px] opacity-75 animate-blob animation-delay-4000 mix-blend-multiply"
        style={{ backgroundColor: "#E2E8F0" }}
      />
    </div>
  );
}