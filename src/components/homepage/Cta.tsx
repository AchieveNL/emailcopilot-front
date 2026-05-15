import Link from "next/link";
import React from "react";

function Cta() {
    return (
        <section className="relative mx-auto mb-20 max-w-315 w-full overflow-hidden rounded-3xl px-6 py-20 text-center">
            {/* Background gradient background: linear-gradient(87.84deg, #4F46E5 0%, #2563EB 57.04%, #06B6D4 98.86%);
*/}
            <div className="absolute inset-0" style={{ background: "linear-gradient(87.84deg, #4F46E5 0%, #2563EB 57.04%, #06B6D4 98.86%)" }} />

            {/* Content */}
            <div className="relative z-10">
                <h2 className="mb-4 font-serif text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] text-[#fafafa]">
                    Ready to land new clients?
                </h2>

                <p className="mb-9 text-base text-white">
                    Join businesses already using EmailCopilot to generate
                    consistent meetings.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center rounded-xl bg-[#fafafa] px-8 py-3.5 font-bold text-primary shadow-[0_4px_24px_rgba(255,255,255,0.1)] transition hover:scale-[1.02]"
                >
                    Hire your own copilot now →
                </Link>
            </div>
        </section>
    );
}

export default Cta;