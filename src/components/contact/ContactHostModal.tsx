"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";

export interface ContactHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  host: {
    id: string;
    name: string;
    avatar: string | null;
    email?: string | null;
    phone?: string | null;
  };
  propertyTitle: string;
}

export function ContactHostModal({
  isOpen,
  onClose,
  host,
  propertyTitle,
}: ContactHostModalProps) {
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);

  const whatsappNumber = host.phone?.replace(/\D/g, "");
  const whatsappMessage =
    "Hi, I'm interested in your property: " + propertyTitle;
  const whatsappLink = whatsappNumber
    ? "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(whatsappMessage)
    : null;
  const emailLink = host.email
    ? "mailto:" +
      host.email +
      "?subject=" +
      encodeURIComponent("Inquiry: " + propertyTitle) +
      "&body=" +
      encodeURIComponent(
        "Hi " +
          host.name +
          ",\n\nI'm interested in your property \"" +
          propertyTitle +
          '" and would like to learn more.\n\nBest regards',
      )
    : null;

  const copyToClipboard = async (text: string, type: "email" | "phone") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Contact " + host.name}
      size="md"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold overflow-hidden flex-shrink-0">
            <Image
              src={host.avatar || "/user.svg"}
              alt={host.name}
              width={64}
              height={64}
              className="w-full h-full rounded-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{host.name}</h3>
            <p className="text-sm text-gray-600">Property Host</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            How would you like to get in touch with {host.name}?
          </p>

          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-600">
                  Quick and direct messaging
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}

          {emailLink && (
            <a
              href={emailLink}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{host.email}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}

          <button
            onClick={() =>
              copyToClipboard(host.email || host.phone || "", "email")
            }
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full"
          >
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Copy Contact</p>
              <p className="text-sm text-gray-600">
                {copied
                  ? "Copied!"
                  : host.email || host.phone || "No contact info"}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 opacity-60">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">In-App Message</p>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          By contacting the host, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </Modal>
  );
}
