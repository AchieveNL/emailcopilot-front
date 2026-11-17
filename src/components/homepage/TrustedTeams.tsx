"use client";
import React from 'react'
import ScrollFloat from './ScrollFloat'
import LogoLoop from './LogoLoop'

const TEAM_LOGOS = [
  { src: "/logos/Vector.svg", alt: "Stripe" },
  { src: "/logos/Group.svg", alt: "Shopify" },
  { src: "/logos/Greenteam logo 1.svg", alt: "Airbnb" },
  { src: "/logos/LOGO.svg", alt: "Netflix" },
  { src: "/logos/Vector2.svg", alt: "Spotify" },
  { src: "/logos/Sharkys 1.svg", alt: "Spotify" },
  { src: "/logos/Layer_1.svg", alt: "Spotify" },
  { src: "/logos/Vector3.svg", alt: "Spotify" },
];

function TrustedTeams() {
    return (
        <section className='flex flex-col z-0 max-w-315 w-full gap-5 my-2 overflow-hidden'>
            {/* make the h2 element vertically centered between the two sections */}
            <ScrollFloat
              as="h2"
              containerClassName="text-[clamp(1.85rem,5.5vw,3.6rem)] leading-[1.08] tracking-[-0.03em] font-serif font-medium text-[#0f0f12] text-center mb-10 flex justify-center w-full"
              textClassName="text-[clamp(1.85rem,5.5vw,3.6rem)] leading-[1.08] tracking-[-0.03em] font-serif font-medium text-[#0f0f12]"
              highlightWords={["growth-focused"]}
            >
              Trusted by growth-focused teams worldwide
            </ScrollFloat>
            <LogoLoop
              logos={TEAM_LOGOS}
              logoHeight={24}
              gap={64}
              speed={50}
              fadeOut={true}
              fadeOutColor="#fafafa"
              renderItem={(item) => {
                const logo = item as any;
                return (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-6 grayscale opacity-80"
                  />
                );
              }}
            />
        </section>
    )
}

export default TrustedTeams
