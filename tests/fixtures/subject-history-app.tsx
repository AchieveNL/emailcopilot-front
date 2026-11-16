import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmailTemplateStep from "../../src/components/ui/NewCopilot/StepFour/EmailTemplateStep";
import TemplateModal from "../../src/components/ui/templates/TemplateModal";
import { SetupFeedbackHost } from "../../src/lib/SetupFeedbackProvider";
import api from "../../src/lib/api";
import type { TemplateForm } from "../../src/lib/types/templates";
import { Platform } from "./feedback-platform";

// No live API traffic, email sends, or stored template writes in this fixture.
api.defaults.adapter = async (config) => {
  if (config.method !== "get" || config.url !== "/templates") throw new Error("Unexpected API operation in subject-history test");
  return { data: [], headers: {}, config, status: 200, statusText: "OK" };
};

function App() {
  const [userId, setUserId] = useState("subject-user-a");
  const [view, setView] = useState("wizard");
  const [form, setForm] = useState<TemplateForm>({ name: "Example", subject: "", body: "<p>Hello</p>", category: "Cold Outreach" });
  const queryClient = useMemo(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }), []);
  const platform = { userId, pathname: "/dashboard/copilots/new", search: "", push: () => {} };
  return (
    <Platform.Provider value={platform}>
      <QueryClientProvider client={queryClient}>
        <SetupFeedbackHost key={userId} userId={userId} pathname={platform.pathname} enabled={false}>
          <div className="p-4 flex gap-4 relative z-[100] bg-white">
            <button id="show-wizard" onClick={() => setView("wizard")}>Wizard</button>
            <button id="show-template" onClick={() => setView("template")}>Template</button>
            <button id="switch-account" onClick={() => setUserId((id) => id === "subject-user-a" ? "subject-user-b" : "subject-user-a")}>Switch account</button>
          </div>
          <main className="p-6">
            {view === "wizard" ? <EmailTemplateStep /> : <TemplateModal editingTemplate={null} form={form} saving={false} onFormChange={setForm} onSave={() => {}} onClose={() => setView("wizard")} />}
          </main>
        </SetupFeedbackHost>
      </QueryClientProvider>
    </Platform.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
