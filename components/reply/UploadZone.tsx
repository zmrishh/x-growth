"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, FileText } from "lucide-react";
import { UploadedImage } from "@/types/reply";
import { MAX_REPLY_IMAGES, MAX_IMAGE_BYTES } from "@/constants/models";

interface UploadZoneProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadZone({ images, onChange }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArr = Array.from(files);
      const remaining = MAX_REPLY_IMAGES - images.length;

      if (remaining <= 0) {
        setError(`Maximum ${MAX_REPLY_IMAGES} images allowed.`);
        return;
      }

      const toProcess = fileArr.slice(0, remaining);
      const newImages: UploadedImage[] = [];

      for (const file of toProcess) {
        if (!ACCEPTED.includes(file.type)) {
          setError(`${file.name}: unsupported format. Use JPEG, PNG, GIF, or WebP.`);
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          setError(`${file.name}: exceeds 5MB limit.`);
          continue;
        }
        const base64 = await readFileAsBase64(file);
        newImages.push({
          name: file.name,
          type: file.type,
          base64,
          sizeBytes: file.size,
        });
      }

      onChange([...images, ...newImages]);
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="relative rounded-xl cursor-pointer transition-all duration-200"
        style={{
          border: `1.5px dashed ${dragging ? "var(--color-accent)" : "var(--color-border-default)"}`,
          background: dragging ? "var(--color-accent-muted)" : "var(--color-bg-elevated)",
          padding: images.length > 0 ? "16px" : "32px",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />

        {images.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: dragging ? "var(--color-accent)" : "var(--color-bg-overlay)",
              }}
            >
              <Upload
                size={18}
                style={{ color: dragging ? "#09090b" : "var(--color-text-tertiary)" }}
              />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                Drop screenshots, memes, or tweets here
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                JPEG, PNG, GIF, WebP up to 5MB each. Max {MAX_REPLY_IMAGES} images.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ background: "var(--color-bg-overlay)", border: "1px solid var(--color-border-default)" }}
                >
                  {img.base64 ? (
                    <img
                      src={img.base64}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={20} style={{ color: "var(--color-text-tertiary)" }} />
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "var(--color-danger)" }}
                >
                  <X size={9} color="white" />
                </button>
              </motion.div>
            ))}

            {images.length < MAX_REPLY_IMAGES && (
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center border-dashed"
                style={{
                  border: "1.5px dashed var(--color-border-default)",
                  color: "var(--color-text-tertiary)",
                }}
              >
                <Upload size={16} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image count indicator */}
      {images.length > 0 && (
        <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
          {images.length}/{MAX_REPLY_IMAGES} images loaded
        </p>
      )}

      {error && (
        <p className="text-xs" style={{ color: "var(--color-danger)" }}>{error}</p>
      )}
    </div>
  );
}
