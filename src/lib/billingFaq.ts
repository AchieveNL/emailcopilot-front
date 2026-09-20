export interface BillingFaq {
  id: number;
  question: string;
  answer: string;
}

/**
 * Copy for the Billing FAQ slide-over. Kept here rather than inside the component
 * so the wording can be edited without touching any markup.
 */
export const BILLING_FAQS: BillingFaq[] = [
  {
    id: 1,
    question: "What payment methods do you accept?",
    answer:
      "We currently accept all major credit and debit cards. We're always looking to expand our supported payment methods.",
  },
  {
    id: 2,
    question: "Can I change my plan at any time?",
    answer:
      "Yes. You can upgrade or downgrade your plan at any time from the Billing page. Your new subscription starts immediately after payment.",
  },
  {
    id: 3,
    question: "Can I cancel my subscription at any time?",
    answer:
      "Absolutely. There are no long-term contracts. You can cancel your subscription at any time from your Billing settings, and your plan will remain active until the end of your current billing period.",
  },
  {
    id: 4,
    question: "When will I be charged?",
    answer:
      "Your subscription renews automatically on the same day of each billing cycle. You can always view your next billing date and upcoming charge from the Billing page.",
  },
  {
    id: 5,
    question: "What happens if my payment fails?",
    answer:
      "If a payment can't be processed, we'll automatically retry your payment and notify you by email. If payment continues to fail, your subscription may be paused until your payment method is updated.",
  },
  {
    id: 6,
    question: "Where can I download my invoices?",
    answer:
      "All of your invoices are available in the Billing History section of your Billing page. You can download them at any time for your records or accounting.",
  },
  {
    id: 7,
    question: "Do you offer annual billing?",
    answer:
      "Yes. You can choose between monthly and annual billing. Annual subscriptions include a discounted rate compared to paying monthly.",
  },
  {
    id: 8,
    question: "Will I lose my data if I downgrade?",
    answer:
      "No. Your data remains safely stored. If your new plan includes lower limits, some features or usage may be restricted until you're within your new plan's limits or decide to upgrade again.",
  },
  {
    id: 9,
    question: "What happens if I reach my monthly email limit?",
    answer:
      "Once you've reached your monthly email allowance, your Copilots will pause sending new emails until your limit resets or you upgrade to a higher plan. Your data, settings, and Copilots remain unchanged.",
  },
  {
    id: 10,
    question: "How do refunds work?",
    answer:
      "We generally don't offer refunds for subscription payments. However, if you've experienced a billing issue or believe you've been charged incorrectly, please contact us and we'll review your case fairly.",
  },
  {
    id: 11,
    question: "Is my payment information secure?",
    answer:
      "Yes. All payments are processed securely through our trusted payment provider. Emailcopilot never stores your full payment card details.",
  },
  {
    id: 12,
    question: "How do I contact billing support?",
    answer:
      "If you have any questions about your subscription, invoices, payments, or billing, our team is here to help.",
  },
];

/** Address used by the FAQ footer and the "Need help?" card. */
export const BILLING_SUPPORT_EMAIL = "info@emailcopilot.io";
