"use client";

import { useState, useRef } from "react";

type VerificationType = "id" | "title_deed" | "other";

interface Document {
  id: string;
  fileName: string;
  verificationType: string;
  createdAt: string;
  webViewLink: string;
}

export default function DriveUploader() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [verificationType, setVerificationType] =
    useState<VerificationType>("id");

  const checkConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/drive/auth");
      const data = await res.json();
      setConnected(data.connected);
      if (data.connected) fetchDocuments();
    } catch (err) {
      setError("Failed to check connection");
    } finally {
      setLoading(false);
    }
  };

  const connectDrive = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/drive/auth");
      const data = await res.json();
      window.location.href = data.authUrl;
    } catch (err) {
      setError("Failed to connect");
      setLoading(false);
    }
  };

  const disconnectDrive = async () => {
    setLoading(true);
    try {
      await fetch("/api/drive/auth", { method: "DELETE" });
      setConnected(false);
      setDocuments([]);
    } catch (err) {
      setError("Failed to disconnect");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/drive/documents");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setError("Failed to fetch documents");
    }
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    const maxSize =
      file.type === "application/pdf" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `File exceeds ${file.type === "application/pdf" ? "5 MB" : "2 MB"} limit`,
      );
      return;
    }

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("verificationType", verificationType);

    try {
      const res = await fetch("/api/drive/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchDocuments();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Verification Documents</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!connected ? (
        <div className="border rounded-lg p-6 text-center space-y-4">
          <p className="text-gray-600">
            Connect your Google Drive to upload verification documents
          </p>
          <button
            onClick={connectDrive}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Connect Google Drive"}
          </button>
        </div>
      ) : (
        <>
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-green-600 font-medium">
                ✓ Google Drive Connected
              </p>
              <button
                onClick={disconnectDrive}
                disabled={loading}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Disconnect
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">Document Type</label>
              <select
                value={verificationType}
                onChange={(e) =>
                  setVerificationType(e.target.value as VerificationType)
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="id">ID Document</option>
                <option value="title_deed">Title Deed</option>
                <option value="other">Other</option>
              </select>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload New File"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Your Documents</h3>
            {documents.length === 0 ? (
              <p className="text-gray-500 text-sm">No documents uploaded yet</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{doc.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {doc.verificationType} •{" "}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={doc.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
