"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { loginWithObject } from "./actions";
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
  Phone,
  MessageCircle,
  Building2,
  LifeBuoy,
  Copy,
  Check,
  X,
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

  // Contact admin UI state
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const [copiedField, setCopiedField] = useState<null | "email" | "phone">(null);

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
      const result = await loginWithObject({
        email,
        password,
        isMainDomain,
        domain,
      });

      if (result.error) {
        console.log("Login error from action:", result.error);

        // Map backend codes to human readable labels
        const errorMap: Record<string, string> = {
          "INVALID_DOMAIN": "Invalid domain for this user",
          "DOMAIN_NOT_FOUND": "Domain not found for this user",
          "INVALID_TENANT": "Invalid tenant for this user",
          "INVALID_CREDENTIALS": "Invalid email or password",
          "CredentialsSignin": "Invalid credentials",
        };

        const message = errorMap[result.error] || result.error;
        setError(message);
        return;
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

  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
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

  const handleCopy = async (value: string, field: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1200);
    } catch {
      // no-op
    }
  };

  // ✅ Contact admin now replaces sign-in content (same red-mark area)
  const renderContactAdminPanel = () => (
    <>
      <div className="mb-8 text-center md:text-left">
        <button
          type="button"
          onClick={() => setShowContactAdmin(false)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </button>

        <div className="flex items-center gap-3 my-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LifeBuoy className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Contact Admin</h1>
        </div>

        <p className="text-muted-foreground font-medium">
          Reach out to your administrator for account creation or access help.
        </p>
      </div>

      <div className="space-y-3">
        {/* Admin Team */}
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold text-foreground">Admin Team</p>
          </div>
          <p className="text-sm text-muted-foreground">
            KalpTree Platform Administration
          </p>
        </div>

        {/* Email */}
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-foreground">Email</p>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                admin@kalptree.xyz
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("admin@kalptree.xyz", "email")}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {copiedField === "email" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-foreground">Phone</p>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                +91 98765 43210
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("+919876543210", "phone")}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {copiedField === "phone" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <a
            href="mailto:admin@kalptree.xyz?subject=Account%20Access%20Request"
            className="inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            Email Admin
          </a>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );

  const renderSignInForm = () => {
    // ✅ if Contact Admin clicked, hide sign-in form area and show contact admin form
    if (showContactAdmin) {
      return renderContactAdminPanel();
    }

    return (
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
              <label className="text-sm font-bold text-foreground">Password</label>
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
          >
            {loading ? "Verifying..." : "Sign In to Dashboard"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>

        <p className="mt-8 text-center text-muted-foreground text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setShowContactAdmin(true)}
            className="font-bold text-primary hover:underline inline"
          >
            Contact Admin
          </button>
        </p>
      </>
    );
  };



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
