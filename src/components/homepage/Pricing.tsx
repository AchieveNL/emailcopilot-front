"use client";
import { PLANS } from "@/store/hompageData";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import ScrollFloat from "./ScrollFloat";
import BorderGlow from "./BorderGlow";

function Pricing() {
  return (
    <section
      id="pricing"
      // remove borders
      className="py-20 px-4 z-0 max-w-315 w-full mx-auto"
    >
      <div style={{ margin: "0 auto" }}>
        <div className="text-center mb-10 flex flex-col items-center justify-center">
          <ScrollFloat
            as="h2"
            containerClassName="text-6xl text-gray-900 leading-tight flex justify-center w-full"
            textClassName="text-6xl leading-tight text-gray-900"
            highlightWords={["flying"]}
            style={{ fontFamily: "DM Serif Display", fontWeight: "normal" }}
          >
            Start flying today!
          </ScrollFloat>
          <ScrollFloat
            as="p"
            containerClassName="mt-2 text-gray-500 text-base font-bold flex justify-center w-full"
            textClassName="text-base font-bold text-gray-500"
          >
            Start as low as €9 /month
          </ScrollFloat>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
          className="pricing-grid"
        >
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <BorderGlow
                key={plan.name}
                className={`w-full max-w-sm text-${plan.textcolor}`}
                borderRadius={24}
                showShadow="small"
                backgroundColor={
                  plan.tag
                    ? "linear-gradient(221.6deg, #06B6D4 4.2%, #168DE0 49.68%, #2563EB 96.05%)"
                    : "#ffffff"
                }
                glowColor={plan.textcolor}
                glowIntensity={plan.tag ? 0.95 : 0.75}
                glowRadius={plan.tag ? 50 : 35}
                colors={
                  plan.tag
                    ? ["#ffffff", "#e0e7ff", "#2563eb"]
                    : ["#6366f1", "#4f46e5", "#3b82f6"]
                }
              >
                {/* a dotted bg to the tagged plan */}

                {plan.tag && (
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                )}

                <div className="relative z-10 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between pt-6 pb-5 px-6">
                    <div className=" pt-6 pb-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl border border-indigo-200 bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Icon className={`text-${plan.textcolor}`} />
                      </div>
                      <div>
                        <h3
                          className={`${plan.tag ? "text-white" : "text-gray-900"} text-[14px] font-bold`}
                        >
                          {plan.name}
                        </h3>
                        <p
                          className={`${plan.tag ? "text-indigo-200" : "text-gray-500"} text-[12px] font-medium`}
                        >
                          {plan.description}
                        </p>
                      </div>
                    </div>
                    {plan.tag && (
                      <div className="">
                        <span className="inline-flex text-[10px] items-center px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
                          {plan.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 mx-6" />

                  {/* Price */}
                  <div className="px-6 pt-5 pb-3">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-bold leading-none ${plan.tag ? "text-white" : `text-${plan.textcolor}`}`}
                      >
                        {plan.price}
                      </span>
                      <span
                        className={`text-base ${plan.tag ? "text-indigo-200" : "text-gray-500"} font-normal`}
                      >
                        / month
                      </span>
                    </div>
                  </div>

                  {/* Email limit badge */}
                  <div className="px-6 pb-5">
                    <span
                      className={`inline-flex text-[12px] items-center px-3.5 py-1.5 rounded-full ${plan.tag ? "bg-white text-gray-900" : "bg-gray-100 text-gray-600"} text-sm font-normal`}
                    >
                      {plan.estimated}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="px-6 flex flex-col gap-4 flex-1">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircleIcon
                          className={`${plan.tag ? "text-indigo-200" : "text-gray-800"}`}
                        />
                        <span
                          className={`text-[12px] ${plan.tag ? "text-indigo-200" : "text-gray-800"} font-normal`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-8 px-4 pb-4">
                    {/* adjust the button styles based on the plan */}
                    <Link
                      href={"login"}
                      className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity shadow-sm `}
                      style={{
                        color: plan.textcolor,
                        backgroundColor: plan.bgcolor,
                      }}
                    >
                      {plan.cta}
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </div>
              </BorderGlow>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
