import HeroCopy from "./HeroCopy";
import HeroVisuals from "./HeroVisuals";

export default function HeroSection() {
  return (
    <>
      {/* it now stops using the viewport height (100vh) on larger devices so it's not leaving any whitespace or gaps */}
      <section className="
        grid grid-cols-1 lg:grid-cols-2 items-center 
        max-w-315 mx-auto w-full
         pt-14 pb-10 mt-10
        sm:pt-16 sm:pb-14
       lg:pt-20 lg:pb-15
        min-h-[calc(100vh-73px)] lg:min-h-auto
      ">
        {/* Left — horizontally centred on mobile, left-aligned on lg+ */}
        <div className="flex justify-center lg:justify-start">
          <HeroCopy />
        </div>

        {/* Right — centred on mobile */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[560px]">
            <HeroVisuals />
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