import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/PageHero";
import logo from "@/assets/nxg-logo.png";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password — Next Gen Church" },
      {
        name: "description",
        content: "Set a new password for your Next Gen Church account.",
      },
      { property: "og:title", content: "Next Gen Church password reset" },
      { property: "og:description", content: "Set a new account password." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // The recovery link carries its token in the URL hash (#type=recovery&access_token=...).
    // The Supabase client picks it up automatically; we only need to confirm it arrived.
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hash.get("type") === "recovery" || hash.get("access_token")) {
      setReady(true);
      return;
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match", { description: "Type the same password twice." });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated", { description: "You can now sign in with it." });
      void navigate({ to: "/auth" });
    } catch (err) {
      toast.error("Could not update password", { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section className="min-h-[80vh] pt-28 md:pt-32">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-lift">
        <img src={logo} alt="Next Gen Church" className="mx-auto h-14 w-auto" />
        <h1 className="mt-4 text-center text-2xl font-extrabold tracking-tight">
          Set a new password
        </h1>
        {ready ? (
          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12 rounded-xl"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="h-12 rounded-full text-base">
              {busy ? "Please wait…" : "Update password"}
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            This page only works from the password reset link in your email. If your link
            expired, request a new one from the sign-in page.
          </p>
        )}
      </div>
    </Section>
  );
}
