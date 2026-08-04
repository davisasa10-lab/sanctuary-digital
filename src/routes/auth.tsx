import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/PageHero";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Staff Sign In — Grace Cathedral Admin" },
      {
        name: "description",
        content:
          "Secure sign in for Grace Cathedral staff to manage events, sermons, giving and prayer requests.",
      },
      { property: "og:title", content: "Grace Cathedral staff sign in" },
      { property: "og:description", content: "Church admin access." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        void navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin" });
        else
          toast.success("Check your email", {
            description: "Confirm your address to finish creating the account.",
          });
      }
    } catch (err) {
      toast.error("Sign in failed", { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section className="min-h-[80vh]">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-lift">
        <h1 className="text-2xl font-extrabold tracking-tight">Staff sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Church administrators only. Contact the office if you need access.
        </p>
        <Tabs value={mode} onValueChange={setMode} className="mt-6">
          <TabsList className="rounded-full">
            <TabsTrigger value="signin" className="rounded-full px-5">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full px-5">
              Create account
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          {mode === "signup" ? (
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                className="h-12 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="h-12 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="h-12 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="h-12 rounded-full text-base">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
      </div>
    </Section>
  );
}