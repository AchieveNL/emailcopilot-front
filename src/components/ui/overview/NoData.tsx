"use client";
import { X } from "lucide-react";

interface NoDataProps {
  title: string;
}
function NoData({ title }: NoDataProps) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-2 rounded-lg bg-primary/5">
      <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center">
        <X size={20} color="#2563eb" />
      </div>
      <p className="text-gray-500 text-sm text-center">{title}</p>
    </div>
  );
}

export default NoData;
