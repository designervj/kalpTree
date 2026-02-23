"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setUser } from "@/hooks/slices/user/userSlice";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Globe,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RenderForgotPasswordForm from "./RenderForgetPasssword";

function SignInForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const search = useSearchParams();

  const initialTenant = search?.get("tenant") || "demo";

  // Sign-in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSlug, setTenantSlug] = useState(initialTenant);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Domain state
  const [isMainDomain, setIsMainDomain] = useState(false);
  const [domain, setDomain] = useState("");

  // Forgot password UI state
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === "kalptree.xyz" || hostname === "localhost") {
      setIsMainDomain(true);
      setDomain("kalptree.xyz");
    } else {
      setIsMainDomain(false);
      setDomain(hostname);
    }
  }, []);

  const handleCancel = () => {
    console.log("gadhhdhh");
    setMode("signin");
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/admin",
        email,
        password,
        isMainDomain,
        domain,
        // tenantSlug,
      });
      if (result?.error) {
        throw new Error(result.error || "Sign-in failed");
      }
      console.log("result", result);
      const session = await getSession();

      console.log("user session--->", session);
      if (session?.user) {
        const mappedUser = {
          email: session.user.email,
          name: session.user.name,
          tenanId: (session.user as any).tenantId, // keeping your existing key usage
          ...(session.user as any),
        };
        dispatch(setUser(mappedUser));
      }

      const type = (session?.user as any)?.tenantdetail?.type;

      if (
        (session && (session.user as any).role === "superadmin") ||
        (session && type === "agency")
      ) {
        router.push("/admin");
      } else {
        router.push("/admin");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Replace this with your actual forgot-password API endpoint
  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      // Example API call (uncomment and update if you already have endpoint)
      // const res = await fetch("/api/auth/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     email: forgotEmail,
      //     isMainDomain,
      //     domain,
      //   }),
      // });
      //
      // const data = await res.json();
      // if (!res.ok) throw new Error(data?.message || "Unable to send reset link");

      // Temporary success UX (design/demo safe)
      await new Promise((resolve) => setTimeout(resolve, 900));

      setForgotSuccess(
        "If this email exists, a password reset link has been sent.",
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unable to send reset link";
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const renderSignInForm = () => (
    <>
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
        <p className="text-muted-foreground font-medium">
          Please enter your details to sign in.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Tenant Slug Input (optional, kept commented as in your code) */}
        {/* <div>
          <label className="block text-sm font-bold text-foreground mb-2">Tenant Slug</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              className="w-full bg-input/50 border border-input rounded-xl pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              placeholder="e.g. demo-store"
            />
          </div>
        </div> */}

        {/* Email Input */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              className="w-full bg-input/50 border border-input rounded-xl pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-foreground">
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setForgotError(null);
                setForgotSuccess(null);
                setMode("forgot");
              }}
              className="text-xs font-bold text-primary hover:text-primary/80 hover:underline"
            >
              Forgot?
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-input/50 border border-input rounded-xl pl-10 pr-12 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 font-medium">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="cursor-pointer h-10 w-full"
          // className="w-full bg-primary hover:opacity-90 text-primary-foreground py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Sign In to Dashboard"}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </Button>
      </form>

      <p className="mt-8 text-center text-muted-foreground text-sm">
        Don't have an account?{" "}
        <a href="#" className="font-bold text-primary hover:underline">
          Contact Admin
        </a>
      </p>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <div className="mb-8 text-center md:text-left">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setForgotError(null);
            setForgotSuccess(null);
          }}
          // className="cursor-pointer h-10 cursor-pointer"
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </button>

        <div className="flex items-center gap-3 my-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Forgot Password
          </h1>
        </div>

        <p className="text-muted-foreground font-medium">
          Enter your email address and we’ll send you a reset link.
        </p>
      </div>

      <form onSubmit={onForgotSubmit} className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Secure Password Recovery
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                We’ll send instructions to your registered email. For security,
                we won’t confirm whether the email exists.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              className="w-full bg-input/50 border border-input rounded-xl pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        {forgotError && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 font-medium">
            {forgotError}
          </div>
        )}

        {forgotSuccess && (
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg border border-emerald-500/20 font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5" />
            <span>{forgotSuccess}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <Button
            type="submit"
            disabled={forgotLoading}
            className="cursor-pointer h-10 w-[49%]"
            // className="w-full bg-primary hover:opacity-90 text-primary-foreground py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {forgotLoading ? "Sending reset link..." : "Send Reset Link"}
            {!forgotLoading && <ArrowRight className="w-5 h-5" />}
          </Button>

          <Button
            type="button"
            onClick={() => {
              setMode("signin");
              setForgotError(null);
              setForgotSuccess(null);
            }}
            variant={"outline"}
            className="cursor-pointer h-10 w-[49%] "
            // className="w-full py-3 rounded-xl font-semibold border border-border text-foreground hover:bg-muted/50 transition-colors"
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden p-12 flex-col justify-between border-r border-border">
        <div className="relative z-10">
          <img
            src="/kalptree-white-logo.svg"
            alt="KalpTree"
            className="w-36 brightness-0 invert my-6"
          />

          <h2 className="text-4xl lg:text-[72px] font-bold text-primary-foreground leading-tight mb-6">
            Enterprise <br />
            <span className="text-white">
              {mode === "forgot" ? "Password Reset" : "Admin Portal"}
            </span>
          </h2>

          <p className="text-primary-foreground/80 text-lg max-w-md">
            {mode === "forgot"
              ? "Recover access securely to your franchise tools, white-label settings, and analytics workspace."
              : "Secure access to your franchise management tools, white-label settings, and global analytics."}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3 text-primary-foreground/70 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-white" />
            RBAC Protected
          </div>
          <div className="flex items-center gap-3 text-primary-foreground/70 text-sm font-medium">
            <Globe className="w-5 h-5 text-white" />
            Multi-Tenant
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-[420px]">
          {mode === "signin" ? (
            renderSignInForm()
          ) : (
            <RenderForgotPasswordForm setMode={handleCancel} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-primary font-medium">
          Loading Application...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
