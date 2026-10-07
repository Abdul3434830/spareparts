"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: "Are the auto spare parts sold by CARS SPARE PARTS genuine OEM?",
    answer:
      "Yes. CARS SPARE PARTS supplies 100% genuine factory OEM parts (Toyota, Honda, Suzuki, Nissan Genuine) as well as certified tier-1 global aftermarket brands including Denso, Bosch, NGK, AISIN, Brembo, and KYB. Every product listing transparently states whether the item is OEM Genuine or Certified Aftermarket.",
  },
  {
    question: "Which vehicle makes and models do you supply parts for in Pakistan?",
    answer:
      "We stock replacement components for all popular automotive makes in Pakistan, including Toyota (Corolla, Yaris, Hilux, Fortuner, Prado, Land Cruiser), Honda (Civic, City, BR-V, Vezel), Suzuki (Alto, Cultus, Swift, Wagon R), as well as Hyundai, Kia, Nissan, Mitsubishi, Mercedes-Benz, BMW, and Audi.",
  },
  {
    question: "How does nationwide courier delivery work across Pakistan?",
    answer:
      "We offer express courier delivery across all cities and towns in Pakistan, including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Sialkot, and Quetta. Urban deliveries generally arrive within 24 to 48 hours, while regional shipments take 2 to 4 business days.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We accept Inter-Bank Fund Transfers (IBFT) through Meezan Bank, mobile wallet payments via Easypaisa and JazzCash, and Cash on Delivery (COD) on eligible orders. Payment confirmations can be sent directly to our verified WhatsApp support.",
  },
  {
    question: "How can I verify that a spare part fits my exact vehicle before ordering?",
    answer:
      "You can send your vehicle chassis number (VIN) or the part number stamped on your original component to our technical team via WhatsApp (+92 318 8303434). Our specialists cross-reference OEM parts catalogs to ensure 100% precision fitment before dispatch.",
  },
  {
    question: "What is your warranty and return policy on auto parts?",
    answer:
      "All eligible replacement components carry manufacturer or distributor warranty protection against defects. If you receive an incorrect or damaged item, you can request an exchange or return within our return window, provided the part is uninstalled and in its original packaging.",
  },
  {
    question: "Can CARS SPARE PARTS source rare, discontinued, or imported car parts?",
    answer:
      "Yes. Through our direct supply partnerships in Japan, Dubai, and Thailand, we regularly import rare, JDM, and European components that are unavailable in local Pakistani markets. Contact our support team for custom sourcing quotes.",
  },
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-xs font-semibold text-brand-amber">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-white tracking-tight">
          Authoritative Answers About Auto Parts & Orders
        </h2>
        <p className="text-sm sm:text-base text-brand-zinc-400">
          Everything you need to know about genuine OEM parts, vehicle compatibility, payment verification, and delivery across Pakistan.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-brand-zinc-800 bg-brand-zinc/60 overflow-hidden transition-colors hover:border-brand-zinc-700"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-brand-white focus:outline-none"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-amber shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-brand-zinc-300 leading-relaxed border-t border-brand-zinc-800/60">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
