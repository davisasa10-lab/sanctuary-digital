import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/db-client";
import { logActivity } from "@/lib/activity";
import { YouTubeImportPanel } from "@/components/admin/YouTubeImportPanel";
import { MediaPickerButton } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Row = Record<string, unknown>;

export type Field = {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "number"
    | "datetime"
    | "date"
    | "switch"
    | "select"
    | "media";
  options?: string[];
  placeholder?: string;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
};

/** Maps a fetched YouTube video onto draft fields. */
export type YouTubeMapping = {
  urlKey: string;
  titleKey?: string;
  descriptionKey?: string;
  thumbnailKey?: string;
  durationKey?: string;
  externalIdKey?: string;
  publishedAtKey?: string;
};

type Props = {
  table: string;
  title: string;
  description?: string;
  columns: Column[];
  fields: Field[];
  defaults: Row;
  orderBy?: { column: string; ascending?: boolean };
  /** Columns searched by the toolbar search box. */
  searchKeys?: string[];
  /** Column used to describe a row in the activity log. */
  labelKey?: string;
  /** Enables the "Import from YouTube" panel in the editor dialog. */
  youtube?: YouTubeMapping;
};

function emptyToNull(value: unknown) {
  return value === "" ? null : value;
}

export function ResourceManager({
  table,
  title,
  description,
  columns,
  fields,
  defaults,
  orderBy,
  searchKeys,
  labelKey,
  youtube,
}: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Row>(defaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [table, "admin"],
    queryFn: async () => {
      let q = db.from(table).select("*");
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: [table, "admin"] });
    void qc.invalidateQueries({ queryKey: [table] });
  };

  const save = useMutation({
    mutationFn: async (values: Row) => {
      const payload: Row = {};
      for (const f of fields) payload[f.key] = emptyToNull(values[f.key]);
      if (editingId) {
        const { error } = await db.from(table).update(payload).eq("id", editingId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await db.from(table).insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Changes saved" : "Created");
      setOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error("Could not save", { description: e.message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error("Could not delete", { description: e.message }),
  });

  const openNew = () => {
    setDraft(defaults);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (row: Row) => {
    const next: Row = { ...defaults };
    for (const f of fields) {
      const value = row[f.key];
      if (f.type === "datetime" && typeof value === "string") {
        next[f.key] = value.slice(0, 16);
      } else {
        next[f.key] = value ?? defaults[f.key] ?? "";
      }
    }
    setDraft(next);
    setEditingId(String(row["id"]));
    setOpen(true);
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <Button className="rounded-full" onClick={openNew}>
          <Plus className="mr-1 size-4" /> New
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : (data ?? []).length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            Nothing here yet. Create the first entry.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.key}>{c.label}</TableHead>
                ))}
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((row) => (
                <TableRow key={String(row["id"])}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className="max-w-xs truncate align-top">
                      {c.render ? c.render(row) : String(row[c.key] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                      <Pencil className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Delete this entry?")) remove.mutate(String(row["id"]));
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? `Edit ${title}` : `New ${title}`}</DialogTitle>
          </DialogHeader>
          <form
            id="resource-form"
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(draft);
            }}
          >
            {fields.map((f) => {
              const value = draft[f.key];
              if (f.type === "switch") {
                return (
                  <div
                    key={f.key}
                    className="flex items-center justify-between rounded-xl border border-border p-3"
                  >
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Switch
                      id={f.key}
                      checked={Boolean(value)}
                      onCheckedChange={(v) => setDraft({ ...draft, [f.key]: v })}
                    />
                  </div>
                );
              }
              if (f.type === "select") {
                return (
                  <div key={f.key} className="grid gap-2">
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Select
                      value={String(value ?? "")}
                      onValueChange={(v) => setDraft({ ...draft, [f.key]: v })}
                    >
                      <SelectTrigger id={f.key} className="rounded-xl">
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                      <SelectContent>
                        {(f.options ?? []).map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              if (f.type === "textarea") {
                return (
                  <div key={f.key} className="grid gap-2">
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Textarea
                      id={f.key}
                      rows={4}
                      className="rounded-xl"
                      value={String(value ?? "")}
                      onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    />
                  </div>
                );
              }
              return (
                <div key={f.key} className="grid gap-2">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Input
                    id={f.key}
                    className="h-11 rounded-xl"
                    placeholder={f.placeholder}
                    type={
                      f.type === "number"
                        ? "number"
                        : f.type === "datetime"
                          ? "datetime-local"
                          : f.type === "date"
                            ? "date"
                            : "text"
                    }
                    value={String(value ?? "")}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        [f.key]:
                          f.type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                  />
                </div>
              );
            })}
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="resource-form"
              className="rounded-full"
              disabled={save.isPending}
            >
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}