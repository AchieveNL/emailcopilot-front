import React from "react";
import { ShieldCheck, Send, TrendingUp, Inbox } from "lucide-react";
function EmailProfileSidebar() {
  return (
    <div className="bg-white border border-gray-200 h-fit rounded-lg p-5">
      <h3 className="font-bold text-sm text-gray-900 mb-4">
        Why connect my email account?
      </h3>

      <div className="space-y-4">
        {/* Item 1 */}
        <div className="flex gap-3">
          <ShieldCheck size={24} className="text-primary/90 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">
              1. Connect securely
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Your account is securely connected via OAuth, so we never see or
              store your password.
            </p>
          </div>
        </div>
        <hr className="border-gray-200" />
        {/* Item 2 */}
        <div className="flex gap-3">
          <Send size={24} className="text-primary/90 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">
              2. Send from your own email address
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              This is helping recipients recognize and trust the sender.
            </p>
          </div>
        </div>
        <hr className="border-gray-200" />
        {/* Item 3 */}
        <div className="flex gap-3 ">
          <TrendingUp size={24} className="text-primary/90 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">
              3. Built for deliverability
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Gradual warmup and daily limits to protect your sender reputation.
            </p>
          </div>
        </div>
        <hr className="border-gray-200" />
        {/* Item 4 */}
        <div className="flex gap-3">
          <Inbox size={24} className="text-primary/90 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">
              4. Replies stay in your inbox
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Gradual warmup and daily limits to protect your sender reputation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailProfileSidebar;
