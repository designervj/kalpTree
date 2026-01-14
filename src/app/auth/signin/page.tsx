"use client";
import { Suspense, useState } from "react";
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
} from "lucide-react";

function SignInForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const search = useSearchParams();
  const initialTenant = search?.get("tenant") || "demo";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSlug, setTenantSlug] = useState(initialTenant);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
        // tenantSlug,
      });

      if (result && (result as any).error) {
        throw new Error((result as any).error || "Sign-in failed");
      }
      console.log("cutomer login result-- ", result);
      const session = await getSession();

      if (session?.user) {
        console.log("cutomer login session-- ", session);
        const mappedUser = {
          email: session.user.email,
          name: session.user.name,
          tenanId: session.user.tenantId,
          ...(session.user as any),
        };
        dispatch(setUser(mappedUser));
      }
      console.log(session);
      if (session && ["agency", "superadmin"].includes(session?.user?.role)) {
        router.push("/admin");
      } else {
        router.push("/admin/websites");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* LEFT PANEL: Branding & Info 
          Uses bg-primary (Plum) and text-white (Gold) for contrast 
      */}
      <div className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden p-12 flex-col justify-between border-r border-border">
        {/* Decorative Background - Using Secondary (Gold/Sand) for glow */}

        <div className="relative z-10">
          {/* Logo brightness inverted to look white on the dark primary background */}
          <img
            src="/kalptree-white-logo.svg"
            alt="KalpTree"
            className="w-36 brightness-0 invert my-6"
          />

          <h2 className="text-4xl lg:text-[72px] font-bold text-primary-foreground leading-tight mb-6">
            Enterprise <br />
            {/* Using Secondary Color for Emphasis */}
            <span className="text-white">Admin Portal</span>
          </h2>

          <p className="text-primary-foreground/80 text-lg max-w-md">
            Secure access to your franchise management tools, white-label
            settings, and global analytics.
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

      {/* RIGHT PANEL: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome{" "}
            </h1>
            <p className="text-muted-foreground font-medium">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Tenant Slug Input */}
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
                <a
                  href="#"
                  className="text-xs font-bold text-primary hover:text-primary/80 hover:underline"
                >
                  Forgot?
                </a>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90 text-primary-foreground py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Sign In to Dashboard"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <a href="#" className="font-bold text-primary hover:underline">
              Contact Admin
            </a>
          </p>
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
