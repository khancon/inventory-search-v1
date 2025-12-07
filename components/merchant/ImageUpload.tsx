"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "../ui/button";

type Props = {
  bucket?: string;
  onUploaded: (url: string) => void;
};

export function ImageUpload({ bucket = "item-images", onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const filePath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const {
      data: { publicUrl }
    } = supabase.storage.from(bucket).getPublicUrl(filePath);
    onUploaded(publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <Button asChild variant="secondary" disabled={uploading}>
        <label className="cursor-pointer">
          {uploading ? "Uploading..." : "Upload image"}
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
