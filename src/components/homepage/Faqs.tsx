import { useState } from 'react'
import { FAQS } from '@/store/hompageData'
import { Plus } from 'lucide-react';

function Faqs() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section id="faqs" style={{ padding: "100px 2rem", background: "#fafafa" }} className='max-w-315 w-full mx-auto'>
            <div className="">
                <div className="text-center mb-10">
                    <h2 className="text-6xl text-gray-900  leading-tight" style={{ fontFamily: 'DM Serif Display' }}>
                        Common{" "}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage:
                                    "linear-gradient(86.91deg, #4f46e5 0%, #2563eb 50%, #06b6d4 100%)",
                            }}
                        >
                            questions
                        </span>{" "}
                        before departure
                    </h2>
                    <p className="mt-2 text-gray-500 text-base font-bold">
                        Cabin crew, prepare for take-off.
                    </p>
                </div>

                <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
                    {FAQS.map((faq, i) => (
                        <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "20px 24px", gap: 16,
                            }}>
                                <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#0f0f12" }}>{faq.q}</span>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 99,
                                    background: openFaq === i ? "#4f46e5" : "rgba(0,0,0,0.06)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0, transition: "all 0.2s",
                                }}>
                                    <Plus size={12} color={openFaq === i ? "#fff" : "#0f0f12"} strokeWidth={2.5}
                                        style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                                </div>
                            </div>
                            <div className="faq-answer" style={{
                                maxHeight: openFaq === i ? "200px" : "0px",
                                opacity: openFaq === i ? 1 : 0,
                            }}>
                                <p style={{ padding: "0 24px 20px", fontSize: "0.875rem", lineHeight: 1.7, color: "#64748B" }}>
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Faqs