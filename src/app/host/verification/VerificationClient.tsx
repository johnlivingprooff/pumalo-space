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
  initialIsAgent: boolean;
  initialAgentNumber: string | null;
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
  initialIsAgent,
  initialAgentNumber,
  initialDocuments,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [documents] = useState(initialDocuments);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAgent, setIsAgent] = useState(initialIsAgent);
  const [agentNumber, setAgentNumber] = useState(initialAgentNumber ?? "");
  const [savingAgent, setSavingAgent] = useState(false);
  const [agentError, setAgentError] = useState("");
  const [agentSaved, setAgentSaved] = useState(false);

  const isManager = initialOwnershipType === "manage";
  const agentRequired =
    isManager || (initialOwnershipType === "own" && isAgent);

  const cfg = STATUS_CONFIG[status];
  const canSubmit = submittable.has(status) && documents.length > 0;

  const saveAgentNumber = async () => {
    setSavingAgent(true);
    setAgentError("");
    setAgentSaved(false);
    try {
      const res = await fetch("/api/host/verification/agent-number", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAgent, agentNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAgentError(data.error || "Failed to save agent number");
        return;
      }
      setAgentSaved(true);
    } catch {
      setAgentError("Network error. Please try again.");
    } finally {
      setSavingAgent(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (agentRequired && !agentNumber.trim()) {
      setError(
        isManager
          ? "Enter your Real Estate Agent Number before submitting."
          : "Enter your Real Estate Agent Number before submitting.",
      );
      return;
    }
    setSubmitting(true);
    try {
      if (agentRequired) await saveAgentNumber();
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
                {isManager ? "Property Agent" : "Property Owner"}
              </span>
            </div>

            {isManager ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Real Estate Agent Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={agentNumber}
                  onChange={(e) => {
                    setAgentNumber(e.target.value);
                    setAgentSaved(false);
                  }}
                  placeholder="e.g., RA-0001234"
                  className="block w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500">
                  Required — you're listing property on behalf of an owner. An
                  admin will verify this number with your documents.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgent}
                    onChange={(e) => {
                      setIsAgent(e.target.checked);
                      setAgentSaved(false);
                    }}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">
                    I am also a licensed real estate agent
                  </span>
                </label>
                {isAgent && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Real Estate Agent Number
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={agentNumber}
                      onChange={(e) => {
                        setAgentNumber(e.target.value);
                        setAgentSaved(false);
                      }}
                      placeholder="e.g., RA-0001234"
                      className="block w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                )}
              </div>
            )}

            {agentError && <p className="text-sm text-red-600">{agentError}</p>}
            {agentSaved && (
              <p className="text-sm text-green-600">Agent number saved.</p>
            )}

            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={saveAgentNumber}
                isLoading={savingAgent}
              >
                Save Agent Number
              </Button>
            </div>
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
