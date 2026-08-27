"use client";

import React, { useState, useEffect } from "react";
import { Extension } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Mail,
  ChevronRight,
  Bold,
  Italic,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  Undo2,
  Redo2,
  ArrowRight,
} from "lucide-react";
import StepsActions from "../StepsActions";
import { templatesApi } from "@/lib/api";
import { useCopilotStore } from "../../../../../store/copilotStore";

const initialEmailBody = `
<p>Hi {{firstName}},</p>
<p>I noticed that {{companyName}} provides private jet services for clients in {{location}}.<br />
I wanted to share a quick idea that could help you attract more qualified charter inquiries and increase bookings without relying solely on referrals or repeat clients.</p>
<p>Would you be open to a quick 15-minute call next week to explore this?</p>
<p>Best regards,<br />
{{senderName}}</p>`;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const toEditorContent = (value: string) => {
  const trimmedValue = value.trim();

  if (trimmedValue.startsWith("<")) {
    return value;
  }

  return value
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const lines = paragraph.split(/\n/).map(escapeHtml);
      return `<p>${lines.join("<br />")}</p>`;
    })
    .join("");
};

const EnterLineBreak = Extension.create({
  name: "enterLineBreak",

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.setHardBreak(),
    };
  },
});

export default function EmailTemplateStep() {
  const [activeTab, setActiveTab] = useState<"steps" | "variables">("steps");
  const [activeStep, setActiveStep] = useState(1);
  // const [smartSending, setSmartSending] = useState(true);
  const [loading, setLoading] = useState(false);
  const [variableInput, setVariableInput] = useState([
    "CompanyName",
    "FirstName",
    "Location",
    "SenderName",
  ]);
  const [subjectInput, setSubjectInput] = useState(
    "Quick idea to help {{companyName}} book more appointments",
  );

  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  const { copilotData, updateCopilotData, setStep } = useCopilotStore();

  const [templateName, setTemplateName] = useState(
    copilotData?.name || "Intro - Book More Appointments",
  );

  const variablesList = [
    {
      id: 1,
      name: "{{CompanyName}}",
      desc: "The recipient's company name",
    },
    {
      id: 2,
      name: "{{FirstName}}",
      desc: "The recipient's first name",
    },
    {
      id: 3,
      name: "{{Location}}",
      desc: "The recipient's location",
    },
    {
      id: 4,
      name: "{{SenderName}}",
      desc: "Your name as the sender",
    },
  ];

  const stepsList = [
    {
      id: 1,
      title: "Step 1 - Initial Email",
      desc: "A personalized cold email",
    },
    // {
    //   id: 2,
    //   title: "Step 2 - Follow-up 1",
    //   desc: "Send 2 days after no reply",
    // },
    // {
    //   id: 3,
    //   title: "Step 3 - Follow-up 2",
    //   desc: "Send 4 days after no reply",
    // },
    // {
    //   id: 4,
    //   title: "Step 4 - Follow-up 3",
    //   desc: "Send 6 days after no reply",
    // },
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const res = await templatesApi.getAll();
        setTemplates(res.data.data || res.data || []);
        console.log("Fetched templates:", res.data.data || res.data || []);
      } catch (error) {
        console.error("Failed to load templates:", error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      EnterLineBreak,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialEmailBody,
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[260px] p-4 text-sm text-slate-700 resize-none focus:outline-none leading-relaxed",
      },
    },
  });

  const insertVariable = (variableName: string) => {
    if (!editor) return;

    editor.chain().focus().insertContent(variableName).run();
    if (variableInput.includes(variableName)) return;
    setVariableInput([...variableInput, variableName]);
  };

  const normalizeVariable = (variable: string): string => {
    return variable.toLowerCase().replace(/\{\{|\}\}/g, "");
  };

  const removeVariable = () => {
    if (!editor) return;
    const editorContent = editor.getHTML();
    const subjectLower = subjectInput.toLowerCase();
    const editorContentLower = editorContent.toLowerCase();

    const variablesToRemove = variableInput.filter((variable) => {
      const normalizedVar = normalizeVariable(variable);
      const inSubject = subjectLower.includes(`{{${normalizedVar}}}`);
      const inEditor = editorContentLower.includes(`{{${normalizedVar}}}`);
      return !inSubject && !inEditor;
    });

    if (variablesToRemove.length > 0) {
      setVariableInput(
        variableInput.filter((v) => !variablesToRemove.includes(v)),
      );
    }
  };

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const editorContent = editor.getHTML();
      const subjectLower = subjectInput.toLowerCase();
      const editorContentLower = editorContent.toLowerCase();

      const variablesInContent = variablesList
        .filter((variable) => {
          const normalizedVar = normalizeVariable(variable.name);
          return (
            subjectLower.includes(`{{${normalizedVar}}}`) ||
            editorContentLower.includes(`{{${normalizedVar}}}`)
          );
        })
        .map((variable) => variable.name);

      setVariableInput(variablesInContent);
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor, subjectInput]);

  const handleSave = async () => {
    setLoading(true);

    if (!copilotData.templateId) {
      const response = await templatesApi.create({
        name: templateName || "initial template",
        subject: subjectInput,
        body: editor.getHTML(),
        variables: variableInput,
      });

      updateCopilotData({ templateId: response.data.id, name: templateName });
    }
    console.log(copilotData);
    setLoading(false);
    setStep(5);
  };

  return (
    <div className="w-full  mx-auto  bg-transparent min-h-150 text-slate-800">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Create your email template
          </h1>
          <p className="text-sm text-slate-500">
            Write the email your copilot will send to your target audience.
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-800">
              Smart sending
            </div>
            <div className="text-xs text-slate-500">
              Automatically stop if a reply is received
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSmartSending(!smartSending)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
              smartSending ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute shadow-sm transition-transform ${
                smartSending ? "translate-x-5" : "translate-x-1"
              }`}
            ></div>
          </button>
        </div> */}
      </div>

      {/* Template Name Input */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
        <label className="text-sm font-semibold text-slate-800 whitespace-nowrap">
          Template name
        </label>
        <div className="w-full flex gap-3">
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
          />
        </div>
      </div>
      <div className="flex justify-end text-xs text-slate-400 mb-6">
        30 / 60
      </div>

      {/* Main Content Split Area */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full  xl:w-60 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex  bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("steps")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "steps"
                  ? "bg-white text-blue-600  border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Steps
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("variables")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "variables"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Variables
            </button>
          </div>

          {/* Steps List */}
          {activeTab === "steps" && (
            <div className="flex flex-col gap-3">
              {stepsList.map((step) => (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left group ${
                    activeStep === step.id
                      ? "border-blue-100 bg-blue-50/40 "
                      : "border-slate-100 hover:border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        activeStep === step.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div
                        className={`text-xs font-bold ${
                          activeStep === step.id
                            ? "text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeStep === step.id
                        ? "text-slate-500"
                        : "text-slate-300 group-hover:text-slate-400"
                    }`}
                  />
                </button>
              ))}

              {/* <button
                type="button"
                className="flex items-center justify-center gap-2 w-full p-4 mt-2 rounded-xl border border-dashed border-slate-300 text-blue-600 hover:bg-blue-50/50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-bold">Add Follow-up Step</span>
              </button> */}
            </div>
          )}

          {activeTab === "variables" && (
            <div className="flex flex-col gap-3">
              {variablesList.map((variable) => (
                <button
                  type="button"
                  key={variable.id}
                  onClick={() => insertVariable(variable.name)}
                  className="flex items-center justify-between p-3 group rounded-xl border border-slate-100 bg-white hover:border-primary/50
                   hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900 mb-1">
                      {variable.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {variable.desc}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Content Area (Editor) */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 ">
          {/* Header of Editor */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Step 1 - Initial Email
              </h2>
              <p className="text-sm text-slate-500">
                This is the first email your leads will receive.
              </p>
            </div>
            {/* <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-semibold"
            >
              <Search className="w-4 h-4" />
              Preview
              <ChevronDown className="w-4 h-4 ml-1" />
            </button> */}
          </div>

          {/* Subject Line */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Subject line
            </label>
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => {
                setSubjectInput(e.target.value);
                removeVariable();
              }}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          {/* Email Body */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-900">
                Email body
              </label>
              <span className="text-xs text-slate-400 font-medium">
                55 / 100
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all bg-white">
              <EditorContent className="editor" editor={editor} />

              {/* Toolbar */}
              <div className="border-t border-slate-100 p-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                    className={`p-2 rounded-lg transition-colors ${
                      editor?.isActive("bold")
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    style={
                      editor?.isActive("bold")
                        ? { background: "var(--btn-gradient)" }
                        : {}
                    }
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    disabled={
                      !editor?.can().chain().focus().toggleItalic().run()
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      editor?.isActive("italic")
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    style={
                      editor?.isActive("italic")
                        ? { background: "var(--btn-gradient)" }
                        : {}
                    }
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
                    className={`p-2 rounded-lg transition-colors ${
                      editor?.isActive("link")
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    style={
                      editor?.isActive("link")
                        ? { background: "var(--btn-gradient)" }
                        : {}
                    }
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-slate-200 mx-1"></div>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("left").run()
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      editor?.isActive({ textAlign: "left" })
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    style={
                      editor?.isActive({ textAlign: "left" })
                        ? { background: "var(--btn-gradient)" }
                        : {}
                    }
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("center").run()
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      editor?.isActive({ textAlign: "center" })
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    style={
                      editor?.isActive({ textAlign: "center" })
                        ? { background: "var(--btn-gradient)" }
                        : {}
                    }
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().undo().run()}
                    disabled={!editor?.can().chain().focus().undo().run()}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().redo().run()}
                    disabled={!editor?.can().chain().focus().redo().run()}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-semibold text-gray-800">
            Your Templates
          </span>
        </div>
      </div>
      {/* Templates Popup */}

      <div className="bg-white rounded-2xl  w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] ">
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 ">
          {/* Loading */}
          {isLoadingTemplates ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div
                className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: "var(--color-primary-light)",
                  borderTopColor: "var(--color-primary)",
                }}
              />
              <p className="text-xs font-medium text-gray-500">
                Fetching templates...
              </p>
            </div>
          ) : /* Empty */
          templates.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center border"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  borderColor: "var(--color-primary)",
                }}
              >
                <Mail
                  className="w-6 h-6"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  No templates yet
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Once you save a template it will appear here, ready to use.
                </p>
              </div>
            </div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setTemplateName(template.name || "");
                    setSubjectInput(template.subject || "");
                    editor?.commands.setContent(
                      toEditorContent(template.body || ""),
                    );
                    if (template.variables)
                      setVariableInput(template.variables);
                    updateCopilotData({
                      templateId: template.id,
                    });
                  }}
                  className="group flex flex-col text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg border transition-colors duration-200"
                      style={{
                        backgroundColor: "var(--color-primary-light)",
                        borderColor: "transparent",
                        color: "var(--color-primary)",
                      }}
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors duration-200 truncate">
                      {template.name}
                    </h4>
                  </div>

                  {/* Subject badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-100 mb-3 w-full overflow-hidden">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                      Subj
                    </span>
                    <span className="text-xs text-gray-600 font-medium truncate">
                      {template.subject}
                    </span>
                  </div>

                  {/* Body preview */}
                  <p
                    className="text-xs text-gray-400 line-clamp-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: template.body }}
                  />

                  {/* Use template CTA */}
                  <div
                    className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Use this template
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <StepsActions
        onPress={() => handleSave()}
        isLoading={loading}
        canContinue={!!(editor && editor.getText().trim().length > 0)}
      />
    </div>
  );
}
