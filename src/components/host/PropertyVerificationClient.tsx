"use client";

import Link from "next/link";
import { useState } from "react";
import DriveUploader from "@/components/host/DriveUploader";
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
  webContentLink: string;
}

interface Props {
  propertyId: string;
  propertyTitle: string;
  initialStatus: VerificationStatus;
  rejectionReason: string | null;
  verifiedAt: string | null;
  initialDocuments: Document[];
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; color: string; bg: string; description: string }
> = {
  PENDING: {
    label: "Not Verified",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    description:
      "This property has not been verified yet. Upload ownership or authorization documents below, then submit for review.",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    description:
      "Our team is reviewing the documents for this property. This usually takes 1–2 business days.",
  },
  VERIFIED: {
    label: "Verified Property",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    description:
      "This property is verified. A badge is shown to renters and buyers.",
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
]);

export function PropertyVerificationClient({
  propertyId,
  propertyTitle,
  initialStatus,
  rejectionReason,
  verifiedAt,
  initialDocuments,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [docCount, setDocCount] = useState(initialDocuments.length);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cfg = STATUS_CONFIG[status];
  const canSubmit = submittable.has(status) && docCount > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/properties/${propertyId}/verification`, {
        method: "PATCH",
      });
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
              aria-hidden="true"
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
            Property Verification
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{propertyTitle}</p>
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

        {/* Documents */}
        {submittable.has(status) ? (
          <DriveUploader
            propertyId={propertyId}
            title="Property Documents"
            onDocumentsChange={setDocCount}
          />
        ) : initialDocuments.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Property Documents
              </h2>
              <span className="text-sm text-gray-500">
                {initialDocuments.length} uploaded
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {initialDocuments.map((doc) => (
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
                    href={doc.webContentLink || doc.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline ml-4 flex-shrink-0"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
            {docCount === 0 && (
              <p className="text-xs text-gray-400 text-center">
                Upload at least one document to submit.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
