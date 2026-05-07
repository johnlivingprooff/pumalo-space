"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InquiryModal } from "@/components/contact/InquiryModal";

type PropertyType = "BUY" | "RENT" | "LODGE";

interface PropertyCTAProps {
  propertyType: PropertyType;
  propertyId: string;
  propertyTitle: string;
  host: {
    id: string;
    name: string;
    avatar: string | null;
    email?: string | null;
    phone?: string | null;
    isVerified?: boolean;
  };
}

const CTA_CONFIG = {
  BUY:   { label: "Make an Offer",      inquiryType: "OFFER"        },
  RENT:  { label: "Request Rental",     inquiryType: "RENTAL"       },
  LODGE: { label: "Check Availability", inquiryType: "AVAILABILITY" },
} as const;

export function PropertyCTA({ propertyType, propertyId, propertyTitle, host }: PropertyCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);

  const { label, inquiryType } = CTA_CONFIG[propertyType];

  return (
    <>
      <Button variant="primary" size="lg" fullWidth onClick={() => setModalOpen(true)}>
        {label}
      </Button>

      <button
        onClick={() => setQuestionModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Contact Host
      </button>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        inquiryType={inquiryType}
        host={host}
      />

      <InquiryModal
        isOpen={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        inquiryType="QUESTION"
        host={host}
      />
    </>
  );
}
