"use client";

import { useCopilotStore } from "@/store/copilotStore";
import OtherProviderPopUp from "@/components/ui/NewCopilot/StepTwo/OtherProviderPopUp";
import StepsActions from "../StepsActions";
import { useState, useEffect } from "react";
import ProvidersOption from "@/components/layout/features/emailAccount/ProvidersOption";
import EmailAccountList from "./EmailAccountList";
import { useEmailAccountStore } from "@/store/emailAccountStore";
import { toast } from "sonner";

export default function Step2EmailProfile() {
  const { copilotData, setStep, persistDraft } = useCopilotStore();
  const { fetchAccounts, showModal, setShowModal, currentAccount, setEditingAccount } = useEmailAccountStore();
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleClosePopup = (saved?: boolean) => {
    setShowModal(false);
    setEditingAccount(null);
    if (saved) {
      fetchAccounts();
    }
  };

  const canContinue = copilotData.emailAccountId !== null;

  return (
    <>
      <ProvidersOption
        setShowOtherProviderPopUp={(show) => {
          if (show) setEditingAccount(null);
          setShowModal(show);
        }}
        setSelectedProfileName={setSelectedProfileName}
        selectedProfileName={selectedProfileName || ""}
        returnTo={`/dashboard/copilots/new?edit=${copilotData.id}`}
      />

      <EmailAccountList setSelectedProfileName={setSelectedProfileName} />

      {showModal && (
        <OtherProviderPopUp
          onClose={handleClosePopup}
          editProfile={currentAccount || undefined}
        />
      )}

      <StepsActions
        onPress={async () => {
          setSaving(true);
          try {
            await persistDraft();
            setStep(3);
          } catch {
            toast.error("Failed to save draft. Please try again.");
          } finally {
            setSaving(false);
          }
        }}
        isLoading={saving}
        canContinue={canContinue}
      />
    </>
  );
}
