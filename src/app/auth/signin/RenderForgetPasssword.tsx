"use client"

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";


type props={
    setMode:(data:string)=>void
}
  const RenderForgotPasswordForm = ({setMode}:props) => {
    
      const [forgotEmail, setForgotEmail] = useState("");
      const [forgotLoading, setForgotLoading] = useState(false);
      const [forgotError, setForgotError] = useState<string | null>(null);
      const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
 
   const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      // Example API call (uncomment and update if you already have endpoint)
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "manish.gupta.mech@gmail.com",
          subject: "Password Reset",
          text: "Please reset your password",
          html: `<p>Please reset your password</p>`,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Unable to send reset link");

      // Temporary success UX (design/demo safe)
    //   await new Promise((resolve) => setTimeout(resolve, 900));

      setForgotSuccess(
        "If this email exists, a password reset link has been sent."
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unable to send reset link";
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };
  

  const handleCancel=()=>{
    console.log("gadhhdhh"  )
    setMode("signin");
    setForgotError(null);
    setForgotSuccess(null);
  }
      return (
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
          <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
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
          onClick={handleCancel}
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
}

export default RenderForgotPasswordForm;