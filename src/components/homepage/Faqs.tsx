"use client";
import { useState } from "react";
import { FAQS } from "@/store/hompageData";
import { Plus } from "lucide-react";
import ScrollFloat from "./ScrollFloat";
import { AnimatedItem } from "./AnimatedList";

function Faqs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Helper function to determine button colors based on FAQ index for visual variety
  const getButtonColor = (index: number) => {
    if (index < 2) return ["#4F46E5", "#F5F3FF"]; // purple
    if (index < 4) return ["#2563EB", "#EFF6FF"]; // blue
    return ["#06B6D4", "#F0FDFF"]; // green
  };

  return (
    <section
      id="faqs"
      style={{ padding: "100px 2rem" }}
      className="max-w-315 z-0 w-full mx-auto"
    >
      <div className="">
        <div className="text-center mb-10 flex flex-col items-center justify-center">
          <ScrollFloat
            as="h2"
            containerClassName="text-6xl text-gray-900 leading-tight flex justify-center w-full"
            textClassName="text-6xl leading-tight text-gray-900"
            highlightWords={["questions"]}
            style={{ fontFamily: "DM Serif Display", fontWeight: "normal" }}
          >
            Common questions before departure
          </ScrollFloat>
          <ScrollFloat
            as="p"
            containerClassName="mt-2 text-gray-500 text-base font-bold flex justify-center w-full"
            textClassName="text-base font-bold text-gray-500"
          >
            Cabin crew, prepare for take-off.
          </ScrollFloat>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          {FAQS.map((faq, i) => (
            <AnimatedItem key={i} index={i} delay={0.05 * i} className="w-full" once={false}>
              <div
                className="faq-item"
                style={{
                  borderBottom:
                    i === FAQS.length - 1
                      ? "none"
                      : "1px solid rgba(0,0,0,0.07)",
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#0f0f12",
                    }}
                  >
                    {faq.q}
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 99,
                      // Button color changes when active, uses plan-specific colors for cohesive design
                      background:
                        openFaq === i ? getButtonColor(i)[1] : "rgba(0,0,0,0.06)",
                      // Button border changes when active
                      border: "1px solid transparent",
                      // Active state border color matches the button's background color
                      borderColor:
                        openFaq === i ? getButtonColor(i)[0] : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    {/* dynamically adjust the icon color to match the button's border color */}
                    <Plus
                      size={12}
                      color={openFaq === i ? getButtonColor(i)[0] : "#0f0f12"}
                      strokeWidth={2.5}
                      style={{
                        transform: openFaq === i ? "rotate(45deg)" : "rotate(0)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="faq-answer"
                  style={{
                    maxHeight: openFaq === i ? "200px" : "0px",
                    opacity: openFaq === i ? 1 : 0,
                  }}
                >
                  <p
                    style={{
                      padding: "0 24px 20px",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "#64748B",
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faqs;
