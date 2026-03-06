"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
  const router = useRouter();
  const search = useSearchParams();

  // Usually reset token comes from email link like /reset-password?token=abc123
  const token = search?.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordChecks = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasMatch: password.length > 0 && password === confirmPassword,
    }),
    [password, confirmPassword]
  );

  const isPasswordValid =
    passwordChecks.minLength &&
    passwordChecks.hasLetter &&
    passwordChecks.hasNumber &&
    passwordChecks.hasMatch;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please complete all password requirements.");
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual reset-password API
      // const res = await fetch("/api/auth/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ token, password }),
      // });
      //
      // const data = await res.json();
      // if (!res.ok) throw new Error(data?.message || "Unable to reset password");

      // Demo delay for UI preview
      await new Promise((resolve) => setTimeout(resolve, 900));

      setSuccess("Your password has been reset successfully.");

      setTimeout(() => {
        router.push("/signin");
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to reset password";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
            Secure <br />
            <span className="text-white">Reset Link</span>
          </h2>

          <p className="text-primary-foreground/80 text-lg max-w-md">
            Create a new password to regain secure access to your KalpTree admin
            portal and tenant workspace.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3 text-primary-foreground/70 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-white" />
            Encrypted Flow
          </div>
          <div className="flex items-center gap-3 text-primary-foreground/70 text-sm font-medium">
            <KeyRound className="w-5 h-5 text-white" />
            Token Verified
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-[430px]">
          <div className="mb-8 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              Set New Password
            </h1>
            <p className="text-muted-foreground font-medium">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                New Password
              </label>
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
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full bg-input/50 border border-input rounded-xl pl-10 pr-12 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Rules */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground mb-1">
                Password requirements
              </p>

              <RuleItem ok={passwordChecks.minLength} text="At least 8 characters" />
              <RuleItem ok={passwordChecks.hasLetter} text="Contains a letter" />
              <RuleItem ok={passwordChecks.hasNumber} text="Contains a number" />
              <RuleItem
                ok={passwordChecks.hasMatch}
                text="Passwords match"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg border border-emerald-500/20 font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer h-10 w-[49%]"
              // className="w-full bg-primary hover:opacity-90 text-primary-foreground py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Updating password..." : "Reset Password"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/signin")}
                variant="outline"
                className="cursor-pointer h-10 w-[49%]"
              //   className="w-full py-3 rounded-xl font-semibold border border-border text-foreground hover:bg-muted/50 transition-colors"
              >
                Back to Sign In
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

function RuleItem({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
        }`}
    >
      <CheckCircle2 className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-primary font-medium">
          Loading Reset Page...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}