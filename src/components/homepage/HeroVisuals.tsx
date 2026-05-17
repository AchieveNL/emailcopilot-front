import { TrendingUp } from "lucide-react";
import Image from "next/image";

function HeroVisuals() {
    return (
        <div className="relative h-[560px] w-full animate-[fadeUp_0.7s_0.15s_ease_both]">

            {/* Subtle glow blob — neutral, not blue */}
            <div className="
        absolute h-[520px] rounded-full pointer-events-none
        top-[-60px] right-[-80px]
        bg-[radial-gradient(ellipse_at_60%_40%,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.02)_55%,transparent_75%)]
        animate-[blobPulse_6s_ease-in-out_infinite]
      " />

            {/* Dots grid — neutral ink */}
            <div className="
        absolute top-2.5 right-2.5 w-[120px] h-[120px] opacity-30 pointer-events-none
        [background-image:radial-gradient(circle,rgba(15,15,18,0.25)_1px,transparent_1px)]
        [background-size:14px_14px]
      " />

            {/* Dashboard card */}
            <div >
                <img src="/dashboard.png" alt="EmailCopilot Dashboard" className="absolute top-0 -left-24  max-w-[790px] rounded-[20px] overflow-hidden
        
        animate-[floatA_5s_ease-in-out_infinite]  h-auto block" />
            </div>

            {/* Inbox card */}
            <div className="absolute bottom-[-130px] right-[-30px] w-[426px] rounded-[20px] z-[2]animate-[floatB_6s_1s_ease-in-out_infinite]
      ">
                <div className="relative">
                    <img src="/inbox.png" alt="EmailCopilot Inbox" className="w-full h-auto block" />
                    {/* Annotation */}
                    <div className="absolute bottom-[46px] right-[358px] pointer-events-none animate-[floatB_5s_0.5s_ease-in-out_infinite] z-[3]">
                        <img src="/replies-to-inbox.png" alt="Replies to inbox" className="min-w-36 h-auto" />
                    </div>
                </div>
            </div>

            {/* Stat pill — matches page.tsx stat-card style */}
            <div className="
        absolute top-10 right-[-20px] z-[3]
        flex items-center gap-2 whitespace-nowrap
        bg-white border border-black/[0.07] rounded-full
        px-4 py-2 pl-2.5
        shadow-[0_4px_16px_rgba(0,0,0,0.08)]
        animate-[floatC_4.5s_0.8s_ease-in-out_infinite]
      ">
                <div className="w-[30px] h-[30px] rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={14} className="text-green-600" strokeWidth={2.5} />
                </div>
                <div>
                    <strong className="block text-[0.8rem] font-extrabold text-[#0f0f12] tracking-[-0.01em]">
                        +40% meetings booked
                    </strong>
                    <span className="text-[0.7rem] text-[#52525e] font-medium">vs. last month</span>
                </div>
            </div>
        </div>
    );
}

export default HeroVisuals;