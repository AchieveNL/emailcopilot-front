import { useState } from "react";
import { Plus, Mail, X, Trash2 } from "lucide-react";
import type { Template, TemplateStep, TemplateForm } from "@/lib/types/templates";

interface TemplateModalProps {
  editingTemplate: Template | null;
  initialSteps?: TemplateStep[];
  form: TemplateForm;
  saving: boolean;
  onFormChange: (form: TemplateForm) => void;
  onSave: (steps: TemplateStep[]) => void;
  onClose: () => void;
}

const INITIAL_STEPS: TemplateStep[] = [
  { id: 1, type: "initial", title: "Step 1 - Initial Email", description: "A personalized cold email", delayDays: 0 },
  { id: 2, type: "followup", title: "Step 2 - Follow-up 1", description: "Send 2 days after no reply", delayDays: 2 },
  { id: 3, type: "followup", title: "Step 3 - Follow-up 2", description: "Send 4 days after no reply", delayDays: 4 },
  { id: 4, type: "followup", title: "Step 4 - Follow-up 3", description: "Send 6 days after no reply", delayDays: 6 },
];

export default function TemplateModal({
  editingTemplate,
  initialSteps,
  form,
  saving,
  onFormChange,
  onSave,
  onClose,
}: TemplateModalProps) {
  const [activeTab, setActiveTab] = useState<"steps" | "variables">("steps");
  const [selectedStep, setSelectedStep] = useState(1);
  const [selectedVariable, setSelectedVariable] = useState("CompanyName");
  const [steps, setSteps] = useState<TemplateStep[]>(initialSteps ?? INITIAL_STEPS);
  // Tracks which input was last focused so variable insertion goes to the right field
  const [lastFocusedField, setLastFocusedField] = useState<"name" | "subject" | "body">("body");

  function addFollowupStep() {
    const lastStep = steps[steps.length - 1];
    const newDelay = lastStep.delayDays + 2;
    const newStep: TemplateStep = {
      id: Date.now(),
      type: "followup",
      title: `Step ${steps.length + 1} - Follow-up ${steps.length - 1}`,
      description: `Send ${newDelay} days after no reply`,
      delayDays: newDelay,
    };
    setSteps([...steps, newStep]);
  }

  function deleteStep(id: number) {
    setSteps((prev) => prev.filter((s) => s.id !== id));
    setSelectedStep((prev) => {
      if (prev === id) {
        const remaining = steps.filter((s) => s.id !== id);
        return remaining.length > 0 ? remaining[0].id : -1;
      }
      return prev;
    });
  }

  function appendVariable(varName: string) {
    const tag = `{{${varName}}}`;
    onFormChange({ ...form, [lastFocusedField]: form[lastFocusedField] + tag });
    setSelectedVariable(varName);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <style>{`.template-modal-scroll{scrollbar-width:thin;scrollbar-color:transparent transparent}.template-modal-scroll:hover{scrollbar-color:#cbd5e1 transparent}.template-modal-scroll::-webkit-scrollbar{width:6px}.template-modal-scroll::-webkit-scrollbar-track{background:transparent}.template-modal-scroll::-webkit-scrollbar-thumb{background:transparent;border-radius:9999px}.template-modal-scroll:hover::-webkit-scrollbar-thumb{background:#cbd5e1}`}</style>
      <div className="template-modal-scroll bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingTemplate ? "Edit email template" : "Create new email template"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Email template name */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email template name
            </label>
            <input
              id="template-field-name"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Name your template"
              value={form.name}
              onFocus={() => setLastFocusedField("name")}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            />
          </div>

          {/* Subject line */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subject line
            </label>
            <input
              id="template-field-subject"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Type your subject line"
              value={form.subject}
              onFocus={() => setLastFocusedField("subject")}
              onChange={(e) => onFormChange({ ...form, subject: e.target.value })}
            />
          </div>

          {/* Email body */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email body
            </label>
            <textarea
              id="template-field-body"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none min-h-[12rem] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={"Hi {{first_name}},\n\nI noticed that {{company}} ...\n\nBest regards,\n{{sender_name}}"}
              value={form.body}
              onFocus={() => setLastFocusedField("body")}
              onChange={(e) => onFormChange({ ...form, body: e.target.value })}
            />
          </div>

          {/* Steps / Variables Tabs - segmented control */}
          <div className="mb-5">
            <div className="inline-flex items-center gap-1 p-1 bg-slate-50/80 border border-slate-200 rounded-xl">
              <button
                onClick={() => setActiveTab("steps")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "steps"
                    ? "text-blue-600 bg-white border border-blue-500 shadow-sm"
                    : "text-slate-700 hover:text-slate-900 border border-transparent"
                }`}
              >
                Steps
              </button>
              <button
                onClick={() => setActiveTab("variables")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "variables"
                    ? "text-blue-600 bg-white border border-blue-500 shadow-sm"
                    : "text-slate-700 hover:text-slate-900 border border-transparent"
                }`}
              >
                Variables
              </button>
            </div>
          </div>

          {/* Steps Content */}
          {activeTab === "steps" && (
            <div className="mb-5">
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step.id)}
                    className={`group w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors cursor-pointer ${
                      selectedStep === step.id
                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedStep === step.id ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      <Mail
                        size={18}
                        className={selectedStep === step.id ? "text-blue-600" : "text-gray-400"}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteStep(step.id); }}
                      className="ml-auto transition-colors w-7 h-7 flex items-center justify-center rounded-md text-gray-300 hover:bg-red-100 hover:text-red-600"
                      title="Delete step"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addFollowupStep}
                className="mt-3 w-full border border-[#E2E8F0] rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-semibold text-[#2563EB] hover:bg-blue-50/50 transition-colors"
              >
                <Plus size={16} />
                Add Follow-up Step
              </button>
            </div>
          )}

          {/* Variables Content */}
          {activeTab === "variables" && (
            <div className="mb-5">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => appendVariable("CompanyName")}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                    selectedVariable === "CompanyName"
                      ? "bg-blue-50/60 border border-blue-100"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${
                    selectedVariable === "CompanyName"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200 rounded-lg font-medium"
                  }`}>
                    T
                  </div>
                  <div className="min-w-0 text-left">
                    <p className={`text-sm font-semibold font-mono ${selectedVariable === "CompanyName" ? "text-gray-900" : "text-gray-900"}`}>{"{{CompanyName}}"}</p>
                    <p className={`text-xs mt-0.5 ${selectedVariable === "CompanyName" ? "text-slate-500" : "text-slate-400"}`}>The company name</p>
                  </div>
                </button>
                <button
                  onClick={() => appendVariable("SenderName")}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                    selectedVariable === "SenderName"
                      ? "bg-blue-50/60 border border-blue-100"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${
                    selectedVariable === "SenderName"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200 rounded-lg font-medium"
                  }`}>
                    T
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 font-mono">{"{{SenderName}}"}</p>
                    <p className={`text-xs mt-0.5 ${selectedVariable === "SenderName" ? "text-slate-500" : "text-slate-400"}`}>First name of the contact</p>
                  </div>
                </button>
                <button
                  onClick={() => appendVariable("Website")}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                    selectedVariable === "Website"
                      ? "bg-blue-50/60 border border-blue-100"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${
                    selectedVariable === "Website"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200 rounded-lg font-medium"
                  }`}>
                    T
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 font-mono">{"{{Website}}"}</p>
                    <p className={`text-xs mt-0.5 ${selectedVariable === "Website" ? "text-slate-500" : "text-slate-400"}`}>Last name of the contact</p>
                  </div>
                </button>
                <button
                  onClick={() => appendVariable("Email")}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                    selectedVariable === "Email"
                      ? "bg-blue-50/60 border border-blue-100"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${
                    selectedVariable === "Email"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200 rounded-lg font-medium"
                  }`}>
                    T
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 font-mono">{"{{Email}}"}</p>
                    <p className={`text-xs mt-0.5 ${selectedVariable === "Email" ? "text-slate-500" : "text-slate-400"}`}>Email address of the contact</p>
                  </div>
                </button>
              </div>

              <button
                className="mt-3 w-full border border-[#E2E8F0] rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-semibold text-[#2563EB] hover:bg-blue-50/50 transition-colors"
              >
                <Plus size={16} />
                Add Variables
              </button>
            </div>
          )}



          {/* Divider */}
          <div className="flex items-center gap-4 py-5 mb-1">
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-sm text-gray-500 text-center whitespace-nowrap">Your email templates</p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Existing Templates Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Cold Outreach – SaaS</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600">22.8% ↑</span>
                <span className="text-gray-500">5 copilots</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Follow-up – No Response</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600">12.7% ↑</span>
                <span className="text-gray-500">3 copilots</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Product Demo Invite</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">0% ↑</span>
                <span className="text-gray-500">0 copilot</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Cold Outreach</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600">9.2% ↑</span>
                <span className="text-gray-500">2 copilots</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Partnership Proposal</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-500">6.1% ↓</span>
                <span className="text-gray-500">1 copilot</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-900 text-sm mb-1">Re-engagement Campaign</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600">22.8% ↑</span>
                <span className="text-gray-500">4 copilots</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(steps)}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
