import React from "react";

/*
 * AnimatedBackground - A fixed full-screen animated background
 * Replicates the elegant dot-grid ripple animation from animations.html
 * combined with the modern, blurred colorful blobs for depth and warmth.
 * Works seamlessly in both light and dark modes.
 */
export default function AnimatedBackground() {
  return (
    <>
      {/* Inline styles for the grid mask, ripple keyframes, and pseudo-elements */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes ripple {
          0% {
            opacity: 0;
            background-size: 0 0;
            transform: scale(0.1);
            -webkit-mask-image: radial-gradient(
              circle at center,
              black 0%,
              black 0%,
              transparent 2%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              black 0%,
              black 0%,
              transparent 2%,
              transparent 100%
            );
          }
          
          10% {
            opacity: 1;
            background-size: 16px 16px;
            transform: scale(0.2);
            -webkit-mask-image: radial-gradient(
              circle at center,
              black 0%,
              black 8%,
              transparent 12%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              black 0%,
              black 8%,
              transparent 12%,
              transparent 100%
            );
          }
          
          20% {
            transform: scale(0.3);
            -webkit-mask-image: radial-gradient(
              circle at center,
              black 0%,
              black 18%,
              transparent 22%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              black 0%,
              black 18%,
              transparent 22%,
              transparent 100%
            );
          }
          
          30% {
            transform: scale(0.4);
            -webkit-mask-image: radial-gradient(
              circle at center,
              black 0%,
              black 28%,
              transparent 32%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              black 0%,
              black 28%,
              transparent 32%,
              transparent 100%
            );
          }
          
          40% {
            transform: scale(0.5);
            -webkit-mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 38%,
              transparent 42%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 38%,
              transparent 42%,
              transparent 100%
            );
          }
          
          50% {
            transform: scale(0.6);
            -webkit-mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 48%,
              transparent 52%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 48%,
              transparent 52%,
              transparent 100%
            );
          }
          
          60% {
            transform: scale(0.7);
            -webkit-mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 58%,
              transparent 62%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 58%,
              transparent 62%,
              transparent 100%
            );
          }
          
          70% {
            transform: scale(0.8);
            -webkit-mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 68%,
              transparent 72%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 68%,
              transparent 72%,
              transparent 100%
            );
          }
          
          80% {
            transform: scale(0.9);
            -webkit-mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 78%,
              transparent 82%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 78%,
              transparent 82%,
              transparent 100%
            );
          }
          
          90% {
            transform: scale(0.95);
            -webkit-mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 88%,
              transparent 92%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              black 88%,
              transparent 92%,
              transparent 100%
            );
          }
        
          100% {
            opacity: 0;
            background-size: 0 0;
            transform: scale(1);
            -webkit-mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle at center,
              transparent 0%,
              transparent 100%
            );
          }
        }

        .lab-bg {
          --mask-offset: 120px;
          -webkit-mask: linear-gradient(to bottom, transparent, #fff var(--mask-offset) calc(100% - var(--mask-offset)), transparent),
                        linear-gradient(to right, transparent, #fff var(--mask-offset) calc(100% - var(--mask-offset)), transparent);
          mask: linear-gradient(to bottom, transparent, #fff var(--mask-offset) calc(100% - var(--mask-offset)), transparent),
                linear-gradient(to right, transparent, #fff var(--mask-offset) calc(100% - var(--mask-offset)), transparent);
          -webkit-mask-composite: source-in, xor;
          mask-composite: intersect;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000;
        }

        .lab-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(0, 0, 0, 0.12) 1px, transparent 1px);
          -webkit-mask-image: radial-gradient(circle at center, transparent 0%, transparent 100%);
          mask-image: radial-gradient(circle at center, transparent 0%, transparent 100%);
          animation: ripple 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform, mask-image, -webkit-mask-image, background-size, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000;
          z-index: 1;
        }
      ` }} />

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

        {/* Elegant masked dot grid & expanding mount ripple animation */}
        <div className="absolute lab-bg inset-0 size-full z-0">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.10)_1px,transparent_1px)] bg-[size:16px_16px]" />
        </div>

      </div>
    </>
  );
}