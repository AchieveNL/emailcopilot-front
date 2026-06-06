import HeroCopy from "./HeroCopy";
import HeroVisuals from "./HeroVisuals";
import Orb from "./Orb";
import Threads from "./Threads";
export default function HeroSection() {
  return (
    <>
      {/* it now stops using the viewport height (100vh) on larger devices so it's not leaving any whitespace or gaps */}
      <section
        className="container
        grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-6
        max-w-315 mx-auto w-full
        px-5 sm:px-6 lg:px-4
        pt-10 pb-10 mt-6
        sm:pt-16 sm:pb-14 sm:mt-10
        lg:pt-20 lg:pb-15
        min-h-[calc(100vh-73px)] lg:min-h-auto
        
      "
      >
        {/* Left — horizontally centred on mobile, left-aligned on lg+ */}
        <div className="flex justify-center lg:justify-start">
          <HeroCopy />
        </div>

        {/* Right — centred on mobile, allow overflow for floating elements */}
        <div className="flex  justify-center lg:justify-end overflow-visible">
          <div className="w-full relative max-w-[420px] sm:max-w-[500px] lg:max-w-[560px]">
            {/* Decorative floating orb */}
            <div className="absolute top-1/4 -right-16 lg:top-1/4 w-90 h-90 md:w-100 md:h-100 -translate-y-1/2  pointer-events-none z-0">
              <Orb
                hoverIntensity={3.49}
                rotateOnHover
                hue={0}
                forceHoverState={false}
                backgroundColor={"transparent"}
              />
            </div>
            <HeroVisuals />
            <div
              style={{
                width: "100%",
                height: "250px",
                position: "relative",

                opacity: 0.1,
              }}
            >
              <div className="absolute z-9999999999 right-0 h-full w-1/2 bg-linear-to-l from-primary-light to-transparent" />
              <Threads
                amplitude={2.7}
                distance={0}
                color={[43, 96, 235]}
                enableMouseInteraction
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-12px) rotate(-0.5deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(1.5deg); }
          50%       { transform: translateY(-16px) rotate(0.8deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes blobPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
