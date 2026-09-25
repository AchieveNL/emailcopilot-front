"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

import { useUser } from "@clerk/nextjs";

import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardContainer from "@/components/layout/DashboardContainer";
import EmailAccountsTable from "@/components/layout/features/emailAccount/EmailAccountTable";

import ProvidersOption from "@/components/layout/features/emailAccount/ProvidersOption";
import { useEmailAccountStore } from "@/store/emailAccountStore";
import OtherProviderPopUp from "@/components/ui/NewCopilot/StepTwo/OtherProviderPopUp";

export default function EmailProfilesPage() {
  const {
    fetchAccounts,
    isLoading,
    accounts,
    showModal,
    setShowModal,
    currentAccount,
    setEditingAccount,
  } = useEmailAccountStore();
  const [showProvders, setShowProviders] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const checkNewParam = () => {
      const params = new URLSearchParams(window.location.search);
      const isNew = params.get("new") === "true";

      if (isNew) {
        setEditingAccount(null);
        setShowProviders(true);
      }
    };
    checkNewParam();
  }, [setEditingAccount, setShowModal]);

  return (
    <DashboardContainer>
      <DashboardHeader
        title="Email Accounts"
        description="Manage the email accounts used for outreach."
        actionLabel="Add Email Account"
        onAction={() => setShowProviders(true)}
        showAction={!showProvders}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Loading...
        </div>
      ) : showProvders ? (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <ProvidersOption
            setShowOtherProviderPopUp={() => {
              setEditingAccount(null);
              setShowModal(true);
            }}
            setSelectedProfileName={() => {}}
            selectedProfileName=""
          />
          <button
            onClick={() => setShowProviders(false)}
            className="inline-flex items-center gap-2 mt-4 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors"
          >
            <ChevronLeft size={15} />
            Go Back
          </button>
        </div>
      ) : (
        <EmailAccountsTable
          accounts={accounts}
          onCreateNew={() => setShowProviders(true)}
        />
      )}

      {/* Modal */}

      {showModal && (
        <OtherProviderPopUp
          onClose={(saved) => {
            setShowModal(false);
            setEditingAccount(null);
            if (saved) {
              fetchAccounts();
            }
          }}
          editProfile={currentAccount || undefined}
        />
      )}
    </DashboardContainer>
  );
}
