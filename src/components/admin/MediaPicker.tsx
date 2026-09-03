import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, ImagePlus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/db-client";
import { logActivity } from "@/lib/activity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BUCKET = "media";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export type MediaAsset = {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  alt_text: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export function useMediaAssets() {
  return useQuery({
    queryKey: ["media_assets"],
    queryFn: async () => {
      const { data, error } = await db
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as MediaAsset[];
    },
  });
}

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function MediaLibrary({ onSelect }: { onSelect?: (url: string) => void }) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useMediaAssets();

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const safeName = file.name.replace(/[^\w.\-]+/g, "-").toLowerCase();
      const path = `${new Date().getFullYear()}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (upErr) throw new Error(upErr.message);
      const { data: signed, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, TEN_YEARS);
      if (signErr) throw new Error(signErr.message);
      const { data: user } = await supabase.auth.getUser();
      const { error } = await db.from("media_assets").insert({
        file_name: file.name,
        storage_path: path,
        public_url: signed?.signedUrl ?? "",
        alt_text: "",
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
        uploaded_by: user.user?.id ?? null,
      });
      if (error) throw new Error(error.message);
      return file.name;
    },
    onSuccess: (name) => {
      toast.success("Uploaded", { description: name });
      void logActivity({ action: "upload", entity: "media_assets", summary: `Uploaded ${name}` });
      void qc.invalidateQueries({ queryKey: ["media_assets"] });
    },
    onError: (e: Error) => toast.error("Upload failed", { description: e.message }),
  });

  const remove = useMutation({
    mutationFn: async (asset: MediaAsset) => {
      await supabase.storage.from(BUCKET).remove([asset.storage_path]);
      const { error } = await db.from("media_assets").delete().eq("id", asset.id);
      if (error) throw new Error(error.message);
      return asset.file_name;
    },
    onSuccess: (name) => {
      toast.success("File removed");
      void logActivity({ action: "delete", entity: "media_assets", summary: `Removed ${name}` });
      void qc.invalidateQueries({ queryKey: ["media_assets"] });
    },
    onError: (e: Error) => toast.error("Could not remove", { description: e.message }),
  });

  const assets = (data ?? []).filter((a) =>
    a.file_name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files…"
          aria-label="Search media library"
          className="h-11 max-w-xs rounded-full"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*,audio/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          className="rounded-full"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
        >
          <Upload className="mr-1 size-4" />
          {upload.isPending ? "Uploading…" : "Upload"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <p className="rounded-2xl border border-border p-10 text-center text-sm text-muted-foreground">
          No files yet. Upload images, audio or PDFs to reuse across the site.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <li key={a.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              {a.mime_type.startsWith("image/") ? (
                <img src={a.public_url} alt={a.alt_text || a.file_name} className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 items-center justify-center bg-muted text-muted-foreground">
                  <ImagePlus className="size-8" />
                </div>
              )}
              <div className="grid gap-2 p-3">
                <p className="truncate text-sm font-semibold">{a.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(a.size_bytes)}</p>
                <div className="flex flex-wrap gap-2">
                  {onSelect ? (
                    <Button size="sm" className="rounded-full" onClick={() => onSelect(a.public_url)}>
                      Use file
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      void navigator.clipboard.writeText(a.public_url);
                      toast.success("Link copied");
                    }}
                  >
                    <Copy className="mr-1 size-3.5" /> Link
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => {
                      if (confirm(`Remove ${a.file_name}?`)) remove.mutate(a);
                    }}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MediaPickerButton({ onSelect }: { onSelect: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="h-11 shrink-0 rounded-xl">
          <ImagePlus className="mr-1 size-4" /> Library
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
        </DialogHeader>
        <MediaLibrary
          onSelect={(url) => {
            onSelect(url);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
