export interface BankAccountDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branch?: string;
}

export interface MobileWalletDetails {
  serviceName: string;
  accountTitle: string;
  mobileNumber: string;
}

export const PAYMENT_CONFIG = {
  supportPhone: "03188303434",
  whatsappNumber: "923188303434",
  supportEmail: "abdulmattenshahzad@gmail.com",

  bank: {
    bankName: "Meezan Bank",
    accountTitle: "ABDUL MATEEN SHEHZAD",
    accountNumber: "11370110610915",
    iban: "PK55MEZN0011370110610915",
    instructions:
      "Transfer through any Pakistani Bank Mobile App, Internet Banking, or ATM via Raast / IBFT.",
  },

  easypaisa: {
    serviceName: "Easypaisa",
    accountTitle: "Abdul Mateen Shahzad",
    mobileNumber: "03188303434",
    instructions:
      "Open your Easypaisa app > Send Money > Easypaisa Transfer > Enter 03188303434.",
  },

  jazzcash: {
    serviceName: "JazzCash",
    accountTitle: "Abdul Mateen Shahzad",
    mobileNumber: "03210803434",
    instructions:
      "Open your JazzCash app > Send Money > To Mobile Account > Enter 03210803434.",
  },
} as const;

export type SupportedPaymentMethod = "BANK_TRANSFER" | "EASYPAISA" | "JAZZ_CASH";

export const PAYMENT_METHODS_LIST = [
  {
    id: "BANK_TRANSFER" as SupportedPaymentMethod,
    name: "Meezan Bank Transfer (IBFT)",
    badge: "Direct Bank",
    title: PAYMENT_CONFIG.bank.accountTitle,
    primaryDetail: PAYMENT_CONFIG.bank.accountNumber,
    secondaryDetail: PAYMENT_CONFIG.bank.iban,
    instructions: PAYMENT_CONFIG.bank.instructions,
  },
  {
    id: "EASYPAISA" as SupportedPaymentMethod,
    name: "Easypaisa",
    badge: "Instant Transfer",
    title: PAYMENT_CONFIG.easypaisa.accountTitle,
    primaryDetail: PAYMENT_CONFIG.easypaisa.mobileNumber,
    instructions: PAYMENT_CONFIG.easypaisa.instructions,
  },
  {
    id: "JAZZ_CASH" as SupportedPaymentMethod,
    name: "JazzCash",
    badge: "Instant Transfer",
    title: PAYMENT_CONFIG.jazzcash.accountTitle,
    primaryDetail: PAYMENT_CONFIG.jazzcash.mobileNumber,
    instructions: PAYMENT_CONFIG.jazzcash.instructions,
  },
];
