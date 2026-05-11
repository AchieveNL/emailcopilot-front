import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";

const TRUST_ITEMS = ["No credit card", "7-day free trial", "Setup in 5 minutes"];

function HeroCopy() {
  return (
    <div className="max-w-[560px] w-full mx-auto lg:mx-0 animate-[fadeUp_0.7s_ease_both] flex flex-col items-center lg:items-start text-center lg:text-left gap-5">

      {/* Badge — matches page.tsx `.pill` style */}
      <div className="
        inline-flex items-center gap-1.5 mb-7
        bg-black/5 text-[#52525e]
        text-[0.75rem] font-medium
        px-3 py-1 rounded-full
        border border-black/[0.08]
      ">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-[pulse_2s_ease-in-out_infinite]" />
        AI-Powered Outbound
      </div>

      {/* Headline */}
      <h1 className="
        text-[clamp(2.4rem,4.5vw,3.6rem)] font-black leading-[1.08]
        tracking-[-0.03em] mb-2.5 text-[#0f0f12]
      ">
        We let AI run your<br />
        outbound sales on<br />
        <em style={{ fontFamily: "'DM Serif Display', serif" }} className="not-italic font-normal text-[#0f0f12]">
          autopilot.
        </em>
      </h1>

      {/* Tagline image */}
      <span className="block mb-6">
        <Image src="/weclome.png" alt="Welcome sparkle" width={250} height={60} className="w-[250px] h-auto" />
      </span>

      {/* Description */}
      <p className="text-[1.05rem] leading-[1.7] text-[#52525e] mb-10">
        You set your <strong className="text-[#0f0f12] font-bold">target audience</strong>, AI{" "}
        <strong className="text-[#0f0f12] font-bold">finds</strong> the right businesses, sends{" "}
        <strong className="text-[#0f0f12] font-bold">personalised emails</strong> from your own address, and replies go
        straight to <strong className="text-[#0f0f12] font-bold">your inbox</strong> — every single day.
      </p>

      {/* CTA buttons — mirrors page.tsx btn-cta / btn-outline */}
      <div className="flex items-center gap-3.5 flex-wrap mb-9 justify-center lg:justify-start">
        <button className="btn-main btn-cta" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
          Get Started Free
          <ArrowRight size={16} />
        </button>
        <button className="btn-main btn-outline" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
          Book a Demo
        </button>
      </div>

      {/* Trust row */}
      <div className="flex items-center gap-5 flex-wrap mb-12 justify-center lg:justify-start">
        {TRUST_ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-1.5 text-[0.83rem] font-semibold text-[#52525e]">
            <Check size={14} className="text-green-500" strokeWidth={2.5} />
            {item}
          </div>
        ))}
      </div>

    </div>
  );
}

export default HeroCopy;