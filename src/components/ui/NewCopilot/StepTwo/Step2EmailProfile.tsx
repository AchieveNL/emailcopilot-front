"use client";

import { useCopilotStore } from "@/store/copilotStore";
import type { NewCopilotContext } from "@/app/dashboard/copilots/new/page";
import OtherProviderPopUp from "@/components/ui/NewCopilot/StepTwo/OtherProviderPopUp";
import StepsActions from "../StepsActions";
import { useState, useEffect } from "react";
import ProvidersOption from "@/components/layout/features/emailAccount/ProvidersOption";
import EmailAccountList from "./EmailAccountList";
import { useEmailAccountStore } from "@/store/emailAccountStore";

interface Step2EmailProfileProps {
  remoteContext: NewCopilotContext;
}

export default function Step2EmailProfile({
  remoteContext,
}: Step2EmailProfileProps) {
  const { copilotData, setStep } = useCopilotStore();
  const { fetchAccounts, showModal, setShowModal, currentAccount, setEditingAccount } = useEmailAccountStore();
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(
    null,
  );

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
        onPress={() => setStep(3)}
        isLoading={false}
        canContinue={canContinue}
      />
    </>
  );
}
