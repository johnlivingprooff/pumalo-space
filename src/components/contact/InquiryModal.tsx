"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

type InquiryType = "OFFER" | "RENTAL" | "AVAILABILITY" | "QUESTION";

interface HostInfo {
  id: string;
  name: string;
  avatar: string | null;
  email?: string | null;
  phone?: string | null;
  isVerified?: boolean;
}

interface HostContact {
  name: string;
  avatar: string | null;
  email: string | null;
  phone: string | null;
}

export interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  inquiryType: InquiryType;
  host: HostInfo;
}

const TYPE_CONFIG = {
  OFFER: {
    title: "Make an Offer",
    messagePlaceholder: "Tell the host about yourself and your offer...",
    showOfferAmount: true,
    showDates: false,
    showViewing: true,
  },
  RENTAL: {
    title: "Request Rental",
    messagePlaceholder: "Introduce yourself and your rental needs...",
    showOfferAmount: false,
    showDates: false,
    showViewing: true,
  },
  AVAILABILITY: {
    title: "Check Availability",
    messagePlaceholder: "Any questions or special requests? (optional)",
    showOfferAmount: false,
    showDates: true,
    showViewing: false,
  },
  QUESTION: {
    title: "Contact Host",
    messagePlaceholder: "What would you like to know?",
    showOfferAmount: false,
    showDates: false,
    showViewing: false,
  },
} as const;

export function InquiryModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  inquiryType,
  host,
}: InquiryModalProps) {
  const config = TYPE_CONFIG[inquiryType];

  const [message, setMessage] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [requestViewing, setRequestViewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hostContact, setHostContact] = useState<HostContact | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!message.trim() && inquiryType !== "AVAILABILITY") {
      setError("Please add a message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          type: inquiryType,
          message: message.trim() || `Checking availability for ${propertyTitle}`,
          offerAmount: offerAmount ? Number(offerAmount) : undefined,
          requestedDates:
            inquiryType === "AVAILABILITY" && checkIn && checkOut
              ? { checkIn, checkOut, guests: Number(guests) }
              : undefined,
          requestViewing,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setHostContact(data.hostContact);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setOfferAmount("");
    setCheckIn("");
    setCheckOut("");
    setGuests("1");
    setRequestViewing(false);
    setError("");
    setHostContact(null);
    onClose();
  };

  const whatsappLink = hostContact?.phone
    ? `https://wa.me/${hostContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I inquired about "${propertyTitle}" on Pumalo Space.`)}`
    : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={config.title} size="md">
      {/* Host trust card */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-primary-100">
          <Image
            src={host.avatar || "/user.svg"}
            alt={host.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{host.name}</p>
            {host.isVerified && <VerifiedBadge size="sm" />}
          </div>
          <p className="text-sm text-gray-500">{propertyTitle}</p>
        </div>
      </div>

      {hostContact ? (
        /* Contact reveal — shown after successful submission */
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg px-4 py-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium">Inquiry sent! You can now reach {hostContact.name} directly.</p>
          </div>

          <div className="space-y-2">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">WhatsApp</p>
                  <p className="text-xs text-gray-500">{hostContact.phone}</p>
                </div>
              </a>
            )}

            {hostContact.email && (
              <a
                href={`mailto:${hostContact.email}?subject=${encodeURIComponent(`Re: ${propertyTitle}`)}`}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Email</p>
                  <p className="text-xs text-gray-500">{hostContact.email}</p>
                </div>
              </a>
            )}

            {hostContact.phone && !whatsappLink && (
              <a
                href={`tel:${hostContact.phone}`}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Phone</p>
                  <p className="text-xs text-gray-500">{hostContact.phone}</p>
                </div>
              </a>
            )}
          </div>

          <Button variant="outline" size="md" fullWidth onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        /* Inquiry form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {config.showOfferAmount && (
            <Input
              label="Your offer (KSH)"
              type="number"
              min={0}
              placeholder="e.g. 5,000,000"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              fullWidth
            />
          )}

          {config.showDates && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Check-in"
                type="date"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                fullWidth
              />
              <Input
                label="Check-out"
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                fullWidth
              />
              <div className="col-span-2">
                <Input
                  label="Guests"
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  fullWidth
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message{inquiryType === "AVAILABILITY" ? " (optional)" : ""}
            </label>
            <textarea
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none text-gray-600 placeholder:text-gray-400"
              rows={4}
              placeholder={config.messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {config.showViewing && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={requestViewing}
                onChange={(e) => setRequestViewing(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Request a viewing</span>
            </label>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
          >
            {config.title}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Host contact details will be shared after you send your inquiry.
          </p>
        </form>
      )}
    </Modal>
  );
}
