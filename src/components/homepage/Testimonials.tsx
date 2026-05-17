"use client";
import { TESTIMONIALS } from '@/store/hompageData'
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react'

function Testimonials() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);




    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="testimonials" className='max-w-315 w-full' style={{ padding: "100px 2rem", background: "#fafafa", overflow: "hidden" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <div className="text-center mb-10">
                    <h2 className="text-6xl text-gray-900  leading-tight" style={{ fontFamily: 'DM Serif Display' }}>

                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage:
                                    "linear-gradient(86.91deg, #4f46e5 0%, #2563eb 50%, #06b6d4 100%)",
                            }}
                        >
                            Trusted
                        </span>{" "}
                        by captains worldwide
                    </h2>
                    <p className="mt-2 text-gray-500 text-base font-bold">
                        Minimum effort with maximum efficiency
                    </p>
                </div>

                {/* Active testimonial */}
                <div style={{ position: "relative", minHeight: 200 }}>

                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={t.name}
                            className="testimonial-card top-0 left-0 right-0 flex items-center flex-col gap-5 bg-white border border-gray-200 rounded-2xl p-10 shadow-md"
                            style={{
                                position: i === activeTestimonial ? "relative" : "absolute",
                                opacity: i === activeTestimonial ? 1 : 0,
                                transform: i === activeTestimonial ? "translateY(0)" : "translateY(16px)",
                                transition: "all 0.5s ease",
                                pointerEvents: i === activeTestimonial ? "auto" : "none",
                            }}
                        >
                            <div className='flex gap-1.5'>
                                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                <Star size={20} className="text-yellow-400 fill-yellow-400" />

                            </div>
                            <div className="quote-icon" style={{ fontSize: "3rem", color: "rgba(0,0,0,0.08)", lineHeight: 1, fontFamily: "Dm Serif Display", flexShrink: 0 }}></div>
                            <div style={{ flex: 1 }}>
                                <p className='text-xl text-gray-900 mb-6 italic text-center'
                                    style={{ lineHeight: 1.7 }}>
                                    {t.quote}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: 14 }} className="justify-center">
                                    <div style={{
                                        width: 44, height: 44, borderRadius: "50%",
                                        background: t.color,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#fff", fontSize: "0.8rem", fontWeight: 700,
                                        flexShrink: 0,
                                    }}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f0f12" }}>{t.name}</div>
                                        <div style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
                    {TESTIMONIALS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTestimonial(i)}
                            style={{
                                width: i === activeTestimonial ? 24 : 8,
                                height: 8, borderRadius: 99,
                                background: i === activeTestimonial ? "var(--color-primary)" : "rgba(0,0,0,0.15)",
                                border: "none", cursor: "pointer",
                                transition: "all 0.3s",
                                padding: 0,
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials