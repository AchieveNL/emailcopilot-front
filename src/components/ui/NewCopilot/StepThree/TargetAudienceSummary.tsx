"use client";

import React, { useMemo } from "react";
import { Building2, Globe, Map, Users } from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";

function TargetAudienceSummary() {
  const { copilotData } = useCopilotStore();
  const { industries, countries, cities } = copilotData.targetProfile;

  // Mock a dynamic audience size based on the number of selected fields
  // const estimatedSize = useMemo(() => {
  //   if (industries.length === 0 && countries.length === 0 && cities.length === 0) return 0;
    
  //   const base = 500;
  //   const indMult = industries.length > 0 ? industries.length * 1.5 : 1;
  //   const counMult = countries.length > 0 ? countries.length * 2 : 1;
  //   const cityMult = cities.length > 0 ? cities.length * 1.2 : 1;
    
  //   return Math.floor(base * indMult * counMult * cityMult);
  // }, [industries, countries, cities]);
const estimatedSize = 8420;  
    let label = "";

  let colorClass = "text-gray-600 bg-gray-100";

  if (estimatedSize > 6000) {
    label = "Massive";
    colorClass = "text-green-600 bg-green-100";
  } else if (estimatedSize > 4000) {
    label = "Large";
    colorClass = "text-green-600 bg-green-100";
  } else if (estimatedSize > 1000) {
    label = "Healthy";
    colorClass = "text-amber-600 bg-amber-100";
    
  } else if (estimatedSize > 500) {
    label = "moderate";
    colorClass = "text-orange-600 bg-orange-100";
  }
   else if (estimatedSize > 100) {
    label = "Limited";
    colorClass = "text-red-600 bg-red-100";
  }
  return (
    <div className="bg-white border border-gray-200 h-fit rounded-xl p-5">
      <h3 className="font-bold text-sm text-gray-900">
        Target Profile Summary
      </h3>
      <p className="text-xs text-gray-500 mt-1 mb-4">
        This is who your copilot will reach.
      </p>

      <div className="space-y-5">
        {/* Industry */}
        <div className="flex gap-3 border-t border-gray-200 pt-3">
          <Building2 size={20} className="text-primary shrink-0 mt-1" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Industry</p>
            <p className="text-xs text-gray-500 mt-1">
              {industries.length > 0 ? industries.join(", ") : "None selected"}
            </p>
          </div>
        </div>

        {/* Country */}
        <div className="flex gap-3 border-t border-gray-200 pt-3">
          <Globe size={20} className="text-primary shrink-0 mt-1" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Country</p>
            <p className="text-xs text-gray-500 mt-1">
              {countries.length > 0 ? countries.join(", ") : "None selected"}
            </p>
          </div>
        </div>

        {/* Cities */}
        <div className="flex gap-3 border-t border-gray-200 pt-3">
          <Map size={20} className="text-primary shrink-0 mt-1" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Cities</p>
            <p className="text-xs text-gray-500 mt-1">
              {cities.length > 0 ? cities.join(", ") : "None selected"}
            </p>
          </div>
        </div>

        {/* Est. audience size */}
        <div className="flex gap-3 items-start border-t border-gray-200 pt-3">
          <Users size={20} className="text-primary shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900">
              Est. audience size
            </p>
            <div className="flex  justify-between mt-1">
              <p className="text-xl font-bold text-gray-900">
                {estimatedSize.toLocaleString()}{" "}
                <span className="text-xs font-normal text-gray-500">
                  companies
                </span>
              </p>
            </div>
          </div>
          <span className={`text-[8px] font-semibold px-1 py-0.5 rounded-sm ${colorClass}`}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TargetAudienceSummary;
