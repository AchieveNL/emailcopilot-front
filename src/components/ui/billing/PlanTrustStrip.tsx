import { Lock, Mail, XCircle } from "lucide-react";

const ITEMS = [
  {
    icon: XCircle,
    title: "Cancel anytime",
    description: "No contracts. Upgrade or downgrade anytime.",
  },
  {
    icon: Mail,
    title: "Your own email",
    description: "Every email is sent from your own connected email account.",
  },
  {
    icon: Lock,
    title: "Secure & reliable",
    description: "Your data is encrypted and never shared.",
  },
];

/** Reassurance row shown underneath the plan cards. */
export default function PlanTrustStrip() {
  return (
    <div className="grid grid-cols-1 gap-6 rounded-xl bg-primary/5 p-6 sm:grid-cols-3">
      {ITEMS.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-white">
            <Icon size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
