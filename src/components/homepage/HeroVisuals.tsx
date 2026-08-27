import { TrendingUp } from "lucide-react";

function HeroVisuals() {
  return (
    <div className="relative w-full animate-[fadeUp_0.7s_0.15s_ease_both] aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[560px]">
      {/* Subtle glow blob — neutral, not blue */}
      <div
        className="
        absolute h-[520px] rounded-full pointer-events-none
        top-[-60px] right-[-80px]
        bg-[radial-gradient(ellipse_at_60%_40%,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.02)_55%,transparent_75%)]
        animate-[blobPulse_6s_ease-in-out_infinite]
        hidden sm:block
      "
      />

      {/* Dots grid — neutral ink */}
      <div
        className="
        absolute top-2.5 right-2.5 w-[120px] h-[120px] opacity-30 pointer-events-none
        [background-image:radial-gradient(circle,rgba(15,15,18,0.25)_1px,transparent_1px)]
        [background-size:14px_14px]
        hidden sm:block
      "
      />

      {/* Dashboard card */}
      <div className="w-full relative z-[1]">
        <img
          src="/dashboard.png"
          alt="EmailCopilot Dashboard"
          className="w-full h-auto rounded-xl sm:rounded-[20px]  animate-[floatA_5s_ease-in-out_infinite] block object-contain"
        />
      </div>

      {/* Inbox card */}
      <div
        className="
        absolute z-2 animate-[floatB_5s_ease-in-out_infinite] rounded-xl sm:rounded-[20px]
        bottom-[-20px] right-[-10px] w-[65%]
        sm:bottom-[-35px] sm:right-[-20px] sm:w-[70%]
        lg:bottom-[-50px] lg:right-[-30px] lg:w-[426px]
      "
      >
        <div className="relative">
          <img
            src="/inbox.png"
            alt="EmailCopilot Inbox"
            className="w-full h-auto block"
          />
          {/* Annotation */}
          <div
            className="
            absolute pointer-events-none animate-[floatB_5s_ease-in-out_infinite] z-[3]
            bottom-[30px] right-[90%]
            sm:bottom-[36px] sm:right-[85%]
            lg:bottom-[46px] lg:right-[358px]

          "
          >
            <img
              src="/replies-to-inbox.png"
              alt="Replies to inbox"
              className="min-w-28 sm:min-w-36 h-auto"
            />
          </div>
        </div>
      </div>

      {/* Stat pill — matches page.tsx stat-card style */}
      <div
        className="
        absolute z-[3]
        flex items-center gap-2 whitespace-nowrap
        bg-white border border-black/[0.07] rounded-full
        shadow-[0_4px_16px_rgba(0,0,0,0.08)]
        animate-[floatC_5s_ease-in-out_infinite]
        top-4 right-[-5px] px-2.5 py-1.5 pl-2 scale-[0.85]
        sm:top-6 sm:right-[-10px] sm:px-3 sm:py-2 sm:pl-2.5 sm:scale-90
        lg:top-10 lg:right-[-20px] lg:px-4 lg:py-2 lg:pl-2.5 lg:scale-100
      "
      >
        <div className="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] rounded-full bg-success/5 flex items-center justify-center flex-shrink-0">
          <TrendingUp size={14} className="text-success" strokeWidth={2.5} />
        </div>
        <div>
          <strong className="block text-[0.72rem] sm:text-[0.8rem] font-extrabold text-[#0f0f12] tracking-[-0.01em]">
            +40% meetings booked
          </strong>
          <span className="text-[0.65rem] sm:text-[0.7rem] text-[#52525e] font-medium">
            vs. last month
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeroVisuals;
