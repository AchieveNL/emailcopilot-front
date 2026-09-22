import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Mail,
  X,
  Trash2,
  Bold,
  Italic,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  Undo2,
  Redo2,
} from "lucide-react";
import type {
  Template,
  TemplateStep,
  TemplateForm,
  TemplateModalProps,
} from "@/lib/types/templates";
import { useEditor, EditorContent } from "@tiptap/react";
import { templatesApi } from "@/lib/api";
import { toEditorContent } from "@/lib/helpers";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

const INITIAL_STEPS: TemplateStep[] = [
  {
    id: 1,
    type: "initial",
    title: "Step 1 - Initial Email",
    description: "A personalized cold email",
    delayDays: 0,
  },
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
  const [steps, setSteps] = useState<TemplateStep[]>(
    initialSteps ?? INITIAL_STEPS,
  );
  // Tracks which input was last focused so variable insertion goes to the right field
  const [lastFocusedField, setLastFocusedField] = useState<
    "name" | "subject" | "body"
  >("body");
  const [existingTemplates, setExistingTemplates] = useState<Template[]>([]);

  useEffect(() => {
    templatesApi
      .getAll()
      .then((res) => {
        setExistingTemplates(res.data || []);
      })
      .catch(() => {});
  }, []);

  function loadTemplate(t: Template) {
    const newBody = t.body || "";
    const newForm = {
      ...form,
      name: t.name || "",
      subject: t.subject || "",
      body: newBody,
      category: t.category || form.category,
    };
    onFormChange(newForm);
    // Update formRef immediately so the editor's onUpdate handler won't read
    // stale name/subject if it fires before the parent re-render flushes.
    formRef.current = newForm;
    if (editor) {
      editor.commands.setContent(toEditorContent(newBody), {
        emitUpdate: false,
      });
    }
    if (t.steps && t.steps.length > 0) {
      setSteps(t.steps);
    }
  }

  // Always holds the latest form so the editor's onUpdate handler never reads stale values.
  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  });

  // Also keep a stable ref to onFormChange so the update handler doesn't need
  // to be torn down and re-created whenever the parent re-renders.
  const onFormChangeRef = useRef(onFormChange);
  useEffect(() => {
    onFormChangeRef.current = onFormChange;
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: toEditorContent(form.body),
    // No onUpdate here — see the useEffect below.
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[12rem] p-4 text-sm text-slate-700 resize-none focus:outline-none leading-relaxed",
      },
    },
  });

  // Register the update listener via effect so it always reads the *current*
  // form through the ref, avoiding the stale-closure that was overwriting
  // name/subject with old values.
  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      onFormChangeRef.current({ ...formRef.current, body: editor.getHTML() });
    };
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor]);

  // When editingTemplate changes, sync the editor content without firing the
  // update handler (which would overwrite the newly-loaded name/subject).
  // Use formRef.current so we always read the *latest* body, not the stale
  // closure value that existed before the parent's state updates flushed.
  useEffect(() => {
    if (editor) {
      const formatted = toEditorContent(formRef.current.body);
      if (editor.getHTML() !== formatted) {
        editor.commands.setContent(formatted, { emitUpdate: false });
      }
    }
  }, [editingTemplate]);

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
    const target = steps.find((s) => s.id === id);
    if (target?.type === "initial") return;
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
    if (lastFocusedField === "body" && editor) {
      editor.chain().focus().insertContent(tag).run();
      onFormChange({ ...form, body: editor.getHTML() });
    } else {
      onFormChange({
        ...form,
        [lastFocusedField]: form[lastFocusedField] + tag,
      });
    }
    setSelectedVariable(varName);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <style>{`.template-modal-scroll{scrollbar-width:thin;scrollbar-color:transparent transparent}.template-modal-scroll:hover{scrollbar-color:#cbd5e1 transparent}.template-modal-scroll::-webkit-scrollbar{width:6px}.template-modal-scroll::-webkit-scrollbar-track{background:transparent}.template-modal-scroll::-webkit-scrollbar-thumb{background:transparent;border-radius:9999px}.template-modal-scroll:hover::-webkit-scrollbar-thumb{background:#cbd5e1}`}</style>
      <div
        className="template-modal-scroll bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingTemplate
                ? "Edit email template"
                : "Create new email template"}
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
              onChange={(e) =>
                onFormChange({ ...form, subject: e.target.value })
              }
            />
          </div>

          {/* Email body */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email body
            </label>
            <div
              className="border border-gray-200 rounded-lg overflow-hidden flex flex-col focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white"
              onFocus={() => setLastFocusedField("body")}
            >
              <EditorContent editor={editor} />
              {/* Toolbar */}
              <div className="border-t border-gray-100 p-2 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded transition-colors ${
                      editor?.isActive("bold")
                        ? "bg-blue-100 text-blue-600 font-bold"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    disabled={
                      !editor?.can().chain().focus().toggleItalic().run()
                    }
                    className={`p-1.5 rounded transition-colors ${
                      editor?.isActive("italic")
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.prompt("Enter URL:");
                      if (url) {
                        editor?.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      editor?.isActive("link")
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("left").run()
                    }
                    className={`p-1.5 rounded transition-colors ${
                      editor?.isActive({ textAlign: "left" })
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("center").run()
                    }
                    className={`p-1.5 rounded transition-colors ${
                      editor?.isActive({ textAlign: "center" })
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().undo().run()}
                    disabled={!editor?.can().chain().focus().undo().run()}
                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-40"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().redo().run()}
                    disabled={!editor?.can().chain().focus().redo().run()}
                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-40"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
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
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedStep === step.id ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <Mail
                        size={18}
                        className={
                          selectedStep === step.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {step.description}
                      </p>
                    </div>
                    {step.type !== "initial" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStep(step.id);
                        }}
                        className="ml-auto transition-colors w-7 h-7 flex items-center justify-center rounded-md text-gray-300 hover:bg-red-100 hover:text-red-600"
                        title="Delete step"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
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
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${
                      selectedVariable === "CompanyName"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 border border-slate-200 rounded-lg font-medium"
                    }`}
                  >
                    T
                  </div>
                  <div className="min-w-0 text-left">
                    <p
                      className={`text-sm font-semibold font-mono ${selectedVariable === "CompanyName" ? "text-gray-900" : "text-gray-900"}`}
                    >
                      {"{{CompanyName}}"}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${selectedVariable === "CompanyName" ? "text-slate-500" : "text-slate-400"}`}
                    >
                      The company name
                    </p>
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
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${
                      selectedVariable === "SenderName"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 border border-slate-200 rounded-lg font-medium"
                    }`}
                  >
                    T
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 font-mono">
                      {"{{SenderName}}"}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${selectedVariable === "SenderName" ? "text-slate-500" : "text-slate-400"}`}
                    >
                      First name of the contact
                    </p>
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
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${
                      selectedVariable === "Website"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 border border-slate-200 rounded-lg font-medium"
                    }`}
                  >
                    T
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 font-mono">
                      {"{{Website}}"}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${selectedVariable === "Website" ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Last name of the contact
                    </p>
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
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${
                      selectedVariable === "Email"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 border border-slate-200 rounded-lg font-medium"
                    }`}
                  >
                    T
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 font-mono">
                      {"{{Email}}"}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${selectedVariable === "Email" ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Email address of the contact
                    </p>
                  </div>
                </button>
              </div>

              <button className="mt-3 w-full border border-[#E2E8F0] rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-semibold text-[#2563EB] hover:bg-blue-50/50 transition-colors">
                <Plus size={16} />
                Add Variables
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 py-5 mb-1">
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-sm text-gray-500 text-center whitespace-nowrap">
              Your email templates
            </p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Existing Templates Grid */}
          {existingTemplates.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              No saved templates yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {existingTemplates.map((t) => {
                const replyRate = t.replyRate ?? 0;
                const isUp = (t.trend ?? "up") === "up";
                const usedIn = t.usedIn ?? 0;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => loadTemplate(t)}
                    className="border border-gray-200 rounded-lg p-5 py-6 text-left hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
                  >
                    <p className="font-semibold text-gray-900 text-sm mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {t.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={
                          replyRate === 0
                            ? "text-gray-500"
                            : isUp
                              ? "text-green-600"
                              : "text-red-500"
                        }
                      >
                        {replyRate}% {replyRate > 0 && (isUp ? "↑" : "↓")}
                      </span>
                      <span className="text-gray-500">
                        {usedIn} {usedIn === 1 ? "copilot" : "copilots"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

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
