"use client";

import { useState, useEffect } from "react";
import { Plus, Mail, ChevronLeft } from "lucide-react";

import { useUser } from "@clerk/nextjs";

import DashboardHeader from "@/components/layout/DashboardHeader";
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
    <div className="p-5 w-full max-w-6xl mx-auto">
      <DashboardHeader
        title={`Email Accounts `}
        description={`   Manage the email accounts used for outreach.`}
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
      ) : accounts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg flex flex-col h-100 items-center justify-center p-12 text-center ">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail size={20} className="text-gray-500" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">
            No email Accounts yet
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Add an email account to start sending outreach.
          </p>
          <button
            onClick={() => setShowProviders(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} /> Add Email Account
          </button>
        </div>
      ) : (
        <EmailAccountsTable accounts={accounts} />
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
    </div>
  );
}
