import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/PageHero";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { homeForUser } from "@/lib/member";
import logo from "@/assets/nxg-logo.png";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In — Next Gen Church" },
      {
        name: "description",
        content: "Sign in to your Next Gen Church account.",
      },
      { property: "og:title", content: "Next Gen Church sign in" },
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
      if (data.session) void homeForUser().then((to) => navigate({ to }));
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        void navigate({ to: await homeForUser() });
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
        if (data.session) void navigate({ to: await homeForUser() });
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

  async function onGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return; // Browser is redirecting to Google
      // Session already set — route by role.
      void navigate({ to: await homeForUser() });
    } catch (err) {
      toast.error("Google sign in failed", { description: (err as Error).message });
      setBusy(false);
    }
  }

  async function onForgotPassword() {
    if (!email) {
      toast.error("Enter your email first", {
        description: "Type your email address above, then tap Forgot password.",
      });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Reset link sent", {
        description: "Check your email for a link to set a new password.",
      });
    } catch (err) {
      toast.error("Could not send reset email", { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }


  return (
    <Section className="min-h-[80vh] pt-28 md:pt-32">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-lift">
        <img src={logo} alt="Next Gen Church" className="mx-auto h-14 w-auto" />
        <h1 className="mt-4 text-center text-2xl font-extrabold tracking-tight">Sign in</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to your Next Gen Church account.
        </p>
        <Tabs value={mode} onValueChange={setMode} className="mt-6">
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-full p-1">
            <TabsTrigger value="signin" className="rounded-full">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full">
              Create account
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={onGoogle}
          className="mt-6 h-12 w-full gap-3 rounded-full text-base font-medium"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.92l3.66-2.86Z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
            />
          </svg>
          Continue with Google
        </Button>
        <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or continue with email
          <span className="h-px flex-1 bg-border" />
        </div>
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