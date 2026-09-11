"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { emailAccountsApi } from "@/lib/api";
import { EmailAccount } from "@/lib/types";

type EmailAccountPayload = Record<string, unknown>;

interface EmailAccountStore {
  accounts: EmailAccount[];
  isLoading: boolean;
  isSaving: boolean;
  verifyingId: number | null;
  oauthConnecting: boolean;
  showModal: boolean;
  currentAccount: EmailAccount | null;
  fetchAccounts: () => Promise<void>;
  createAccount: (data: EmailAccountPayload) => Promise<void>;
  deleteAccount: (id: number) => Promise<void>;
  verifyAccount: (id: number) => Promise<void>;
  oauthConnect: (provider: string, returnTo?: string) => Promise<void>;
  setEditingAccount: (account: EmailAccount | null) => void;
  setShowModal: (showModal: boolean) => void;
}

export const useEmailAccountStore = create<EmailAccountStore>((set, get) => ({
  accounts: [],
  isLoading: false,
  isSaving: false,
  verifyingId: null,
  oauthConnecting: false,
  showModal: false,
  currentAccount: null,

  fetchAccounts: async () => {
    set({ isLoading: true });
    try {
      const response = await emailAccountsApi.getAll();
      set({ accounts: response.data });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch email accounts");
    } finally {
      set({ isLoading: false });
    }
  },

  createAccount: async (data) => {
    set({ isSaving: true });
    try {
      await emailAccountsApi.create(data);
      await get().fetchAccounts();
      toast.success("Email account created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create email account");
    } finally {
      set({ isSaving: false });
    }
  },

  deleteAccount: async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this email account?",
    );

    if (!confirmed) return;

    try {
      await emailAccountsApi.delete(id);

      set((state) => ({
        accounts: state.accounts.filter((account) => account.id !== id),
      }));

      toast.success("Email account deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete email account");
    }
  },

  verifyAccount: async (id) => {
    set({ verifyingId: id });
    try {
      const result = await emailAccountsApi.verify(id);
      console.log("Verification result:", result);
      await get().fetchAccounts();

      if (result.data.smtpStatus === "error") {
        toast.error(
          "Email account verification failed,please make sure the account is correctly configured.",
        );
      } else {
        toast.success("Email account verified successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify email account");
    } finally {
      set({ verifyingId: null });
    }
  },

  oauthConnect: async (provider, returnTo) => {
    set({ oauthConnecting: true });
    try {
      const response = await emailAccountsApi.oauthConnect(provider, returnTo);
      await get().fetchAccounts();
      console.log("OAuth connection successful:", response.data);
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect via OAuth");
    } finally {
      set({ oauthConnecting: false });
    }
  },
  setEditingAccount: (account) => {
    set({ currentAccount: account });
  },
  setShowModal: (showModal) => set({ showModal: showModal }),
}));
