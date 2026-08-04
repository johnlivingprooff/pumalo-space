"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

type VerificationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "NEEDS_RESUBMISSION";

interface Document {
  id: string;
  fileName: string;
  verificationType: string;
  createdAt: string;
  webViewLink: string;
}

interface Props {
  initialStatus: VerificationStatus;
  rejectionReason: string | null;
  verifiedAt: string | null;
  initialOwnershipType: string | null;
  initialPropertyType: string | null;
  initialEalbNumber: string | null;
  initialTraNumber: string | null;
  initialDocuments: Document[];
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; color: string; bg: string; description: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    description: "Upload your documents below, then submit for review.",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    description:
      "Our team is reviewing your documents. This usually takes 1–2 business days.",
  },
  VERIFIED: {
    label: "Verified",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    description:
      "Your account is verified. Your badge is visible on all your listings.",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    description:
      "Verification was unsuccessful. See the reason below and resubmit.",
  },
  NEEDS_RESUBMISSION: {
    label: "Needs Resubmission",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    description: "Please upload updated documents and resubmit.",
  },
};

const submittable = new Set<VerificationStatus>([
  "PENDING",
  "NEEDS_RESUBMISSION",
  "REJECTED",
]);

export function VerificationClient({
  initialStatus,
  rejectionReason,
  verifiedAt,
  initialOwnershipType,
  initialPropertyType,
  initialEalbNumber,
  initialTraNumber,
  initialDocuments,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [documents] = useState(initialDocuments);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ealbNumber, setEalbNumber] = useState(initialEalbNumber ?? "");
  const [traNumber, setTraNumber] = useState(initialTraNumber ?? "");
  const [savingLicense, setSavingLicense] = useState(false);
  const [licenseError, setLicenseError] = useState("");
  const [licenseSaved, setLicenseSaved] = useState(false);

  const isManager = initialOwnershipType === "manage";
  const isLodge = initialPropertyType === "LODGE";
  const needsEalb = isManager;
  const needsTra = isLodge;

  const cfg = STATUS_CONFIG[status];
  const canSubmit = submittable.has(status) && documents.length > 0;

  const saveLicenseNumber = async () => {
    setSavingLicense(true);
    setLicenseError("");
    setLicenseSaved(false);
    try {
      const res = await fetch("/api/host/verification/license-number", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ealbNumber, traNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLicenseError(data.error || "Failed to save license number");
        return;
      }
      setLicenseSaved(true);
    } catch {
      setLicenseError("Network error. Please try again.");
    } finally {
      setSavingLicense(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (needsEalb && !ealbNumber.trim()) {
      setError("Enter your EALB certificate number before submitting.");
      return;
    }
    if (needsTra && !traNumber.trim()) {
      setError("Enter your TRA number before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      if (needsEalb || needsTra) await saveLicenseNumber();
      const res = await fetch("/api/host/verification", { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit");
        return;
      }
      setStatus(data.verificationStatus);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/host/listings"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to listings
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Host Verification
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Verified hosts get a trust badge on their listings and profile.
          </p>
        </div>

        {/* Status card */}
        <div className={`border rounded-xl p-5 ${cfg.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
            {status === "VERIFIED" && <VerifiedBadge size="md" />}
          </div>
          <p className={`text-sm ${cfg.color}`}>{cfg.description}</p>
          {status === "VERIFIED" && verifiedAt && (
            <p className="text-xs text-green-600 mt-1">
              Verified on{" "}
              {new Date(verifiedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
          {(status === "REJECTED" || status === "NEEDS_RESUBMISSION") &&
            rejectionReason && (
              <p className="text-sm mt-2 font-medium text-red-700">
                Reason: {rejectionReason}
              </p>
            )}
        </div>

        {/* Professional details */}
        {initialOwnershipType && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Professional Details
              </h2>
              <span className="text-sm text-gray-500 capitalize">
                {isManager
                  ? "Property Agent"
                  : isLodge
                    ? "Short-term Host"
                    : "Property Owner"}
              </span>
            </div>

            {needsEalb && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  EALB Certificate Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={ealbNumber}
                  onChange={(e) => {
                    setEalbNumber(e.target.value);
                    setLicenseSaved(false);
                  }}
                  placeholder="e.g., EALB-0001234"
                  className="block w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500">
                  Required — you're listing property on behalf of an owner. An
                  admin will verify this number with your documents.
                </p>
              </div>
            )}

            {needsTra && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  TRA Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={traNumber}
                  onChange={(e) => {
                    setTraNumber(e.target.value);
                    setLicenseSaved(false);
                  }}
                  placeholder="e.g., TRA-0001234"
                  className="block w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500">
                  Required for short-term / holiday rentals — this is your
                  Tourism Regulatory Authority registration number.
                </p>
              </div>
            )}

            {!needsEalb && !needsTra && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <span className="font-medium">
                    You're listing as a direct owner.
                  </span>{" "}
                  No professional license is needed. When you verify your
                  property, you'll upload a Certificate of Ownership or proof of
                  payment for the land.
                </p>
              </div>
            )}

            {licenseError && (
              <p className="text-sm text-red-600">{licenseError}</p>
            )}
            {licenseSaved && (
              <p className="text-sm text-green-600">License number saved.</p>
            )}

            {(needsEalb || needsTra) && (
              <div className="flex items-center gap-3 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveLicenseNumber}
                  isLoading={savingLicense}
                >
                  Save License Number
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Your Documents</h2>
            <span className="text-sm text-gray-500">
              {documents.length} uploaded
            </span>
          </div>

          {documents.length === 0 ? (
            <p className="text-sm text-gray-500">No documents uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {doc.verificationType.replace("_", " ").toLowerCase()} ·{" "}
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={doc.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline ml-4 flex-shrink-0"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Upload link — reuses existing DriveUploader page */}
          {submittable.has(status) && (
            <Link
              href="/host/verification/upload"
              className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload document
            </Link>
          )}
        </div>

        {/* Submit */}
        {submittable.has(status) && (
          <div className="space-y-2">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSubmit}
              isLoading={submitting}
              disabled={!canSubmit}
            >
              Submit for Review
            </Button>
            {documents.length === 0 && (
              <p className="text-xs text-gray-400 text-center">
                Upload at least one document to submit.
              </p>
            )}
          </div>
        )}

        {/* What verification unlocks */}
        {status !== "VERIFIED" && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3">
              What verification unlocks
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Blue verified badge on all your listings",
                "Badge visible in inquiry modals — builds buyer trust",
                "Higher credibility with potential renters and buyers",
                "Reduced chance of listings being flagged",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
