"use client";
import { Mail, X } from "lucide-react";
import { useState } from "react";

interface EmailPreviewCardProps {
  subject?: string;
  body?: string;
  onClose?: () => void;
}

function stripHtml(html: string) {
  return html
    .replace(/<\/p>\s*<p>/gi, "\n\n") // paragraph breaks
    .replace(/<[^>]+>/g, "") // remove remaining tags
    .trim();
}





function EmailPreviewCard({
  subject = "Quick idea to help {{company}} book more appointments",
  body = `Hi {{first_name}},

I noticed that {{company}} provides private jet services for clients in {{location}}.
I wanted to share a quick idea that could help you attract more qualified charter inquiries and increase bookings without relying solely on referrals or repeat clients.

Would you be open to a quick 15-minute call next week to explore this?

Best regards,
{{sender_name}}`,
  onClose,
}: EmailPreviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log("body template:", body);

  return (
    <>
      {/* Backdrop - click outside to close */}
      <div className="fixed inset-0 z-90 bg-black/20" onClick={onClose} />

      <div className="bg-white border fixed z-100 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-gray-200 rounded-2xl shadow-lg w-90 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-3.5 border-b border-gray-100 relative">
          <Mail size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600">
            Intro – Book More Appointments
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-76 overflow-y-auto">
          {/* Subject line */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-900">Subject line</p>
            <p className="text-xs text-gray-400">{subject}</p>
          </div>

          {/* Email body */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-900">Email body</p>
            <p
              className={`text-xs text-gray-400 whitespace-pre-line leading-relaxed ${
                isExpanded ? "" : "line-clamp-10"
              }`}
            >
              {stripHtml(body)}
            </p>
          </div>
        </div>

        {/* Footer button */}
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all"
          >
            <Mail size={14} />
            {isExpanded ? "Show less" : "View full message"}
          </button>
        </div>
      </div>
    </>
  );
}

export default EmailPreviewCard;
