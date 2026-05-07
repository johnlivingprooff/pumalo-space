"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface DriveImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function DriveImageUpload({
  value = [],
  onChange,
  maxImages = 10,
}: DriveImageUploadProps) {
  const [images, setImages] = useState<string[]>(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImages(value);
  }, [value]);

  useEffect(() => {
    fetch("/api/drive/auth")
      .then((r) => r.json())
      .then((d) => setConnected(d.connected))
      .catch(() => setConnected(false));
  }, []);

  const connect = async () => {
    const res = await fetch("/api/drive/auth");
    const data = await res.json();
    window.location.href = data.authUrl;
  };

  const handleFiles = async (files: FileList) => {
    setError("");
    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of toUpload) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/drive/image-upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        break;
      }
      newUrls.push(data.url);
    }

    const updated = [...images, ...newUrls];
    setImages(updated);
    onChange(updated);
    setUploading(false);
  };

  const remove = (url: string) => {
    const updated = images.filter((u) => u !== url);
    setImages(updated);
    onChange(updated);
  };

  const setMain = (url: string) => {
    const updated = [url, ...images.filter((u) => u !== url)];
    setImages(updated);
    onChange(updated);
  };

  if (connected === false) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-3">
        <p className="text-sm text-gray-600">
          Connect Google Drive to upload property images
        </p>
        <button
          type="button"
          onClick={connect}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Connect Google Drive
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, i) => (
            <div
              key={url}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${i === 0 ? "border-blue-400" : "border-gray-200 hover:border-blue-300 cursor-pointer"}`}
              onClick={() => i !== 0 && setMain(url)}
            >
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(url);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {i === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || connected === null}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors disabled:opacity-50"
          >
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-sm font-medium text-gray-700">
                {uploading
                  ? "Uploading to Google Drive..."
                  : "Click to upload images"}
              </p>
              <p className="text-xs text-gray-500">
                {images.length} / {maxImages} uploaded · max 5 MB each
              </p>
            </div>
          </button>
        </>
      )}
    </div>
  );
}
