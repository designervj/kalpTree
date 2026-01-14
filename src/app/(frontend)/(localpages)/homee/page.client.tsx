"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Shield,
  Layout,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Layers,
  Lock,
  BarChart3,
  Star,
  Globe,
  ChevronDown,
} from "lucide-react";

export default function RootClientPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  const handleLogin = () => {
    if (user) router.push("/admin");
    else router.push("/auth/signin");
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* =========================================
         SECTION 1: HERO (Plum Brand Color)
      ========================================= */}
      <section className="relative bg-primary pt-24 pb-40 px-6 overflow-hidden">
        {/* Background Decorative Glows (Gold/Sand) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/20 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full -ml-20 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Logo Container */}
          <div className="inline-flex items-center justify-center p-4 rounded-2xl mb-8 animate-fade-in">
            <img
              src="/kalptree-white-logo.svg"
              alt="KalpTree Logo"
              className="w-56 h-auto brightness-0 invert"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6  leading-[1.1]">
            Management <span className="text-white">Redefined.</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            The ultimate RBAC engine for enterprise franchises. Seamless
            white-labeling, deep analytics, and granular control in one
            sophisticated dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleLogin}
              className="group px-10 py-4 bg-white text-primary hover:bg-secondary hover:text-white font-bold rounded-full transition-all shadow-[0_0_30px_rgba(0,0,0,0.2)] flex items-center gap-2"
            >
              Go to Admin Dashboard{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
         SECTION 2: STATS BAR (Floating)
      ========================================= */}
      <section className="relative z-20 -mt-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-10 rounded-[24px] shadow-xl shadow-slate-200/50 border border-slate-100">
          <Stat item="10k+" label="Active Users" />
          <Stat item="500+" label="Franchises" />
          <Stat item="99.9%" label="Uptime" />
          <Stat item="24/7" label="Support" />
        </div>
      </section>

      {/* =========================================
         SECTION 3: CORE FEATURES (Clean Grid)
      ========================================= */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-secondary-foreground font-bold tracking-widest uppercase text-xs mb-2 block">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-[48px] font-bold mb-6 text-primary">
            Powerful Features
          </h2>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="text-primary" />}
            title="RBAC Security"
            desc="Enterprise-level Role Based Access Control with custom permission levels and hierarchical inheritance."
          />
          <FeatureCard
            icon={<Layout className="text-primary" />}
            title="White Labeling"
            desc="Transform the UI to match your franchise branding with dynamic CSS injection and logo management."
          />
          <FeatureCard
            icon={<Zap className="text-primary" />}
            title="Fast Onboarding"
            desc="Invite clients and setup new franchise tenants in seconds with our automated onboarding workflow."
          />
          <FeatureCard
            icon={<Globe className="text-primary" />}
            title="Multi-Tenant"
            desc="Strict data isolation ensures that franchise data never leaks between different tenant environments."
          />
          <FeatureCard
            icon={<BarChart3 className="text-primary" />}
            title="Analytics"
            desc="Real-time insights into user activity, login patterns, and system usage across all nodes."
          />
          <FeatureCard
            icon={<Layers className="text-primary" />}
            title="API First"
            desc="Built on a robust API architecture allowing seamless integration with your existing CRM tools."
          />
        </div>
      </section>

      {/* =========================================
         SECTION 4: WORKFLOW (Alternating)
      ========================================= */}
      <section className="py-24 bg-muted/30 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Lock className="w-4 h-4" /> Enterprise Ready
            </div>
            <h2 className="text-4xl font-bold mt-2 mb-6 leading-tight text-foreground">
              Advanced Control for <br />
              Global Teams
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              KalpTree provides a centralized command center for managing
              thousands of users across unlimited franchise locations.
            </p>
            <div className="space-y-4">
              <CheckItem text="Hierarchical data isolation between tenants" />
              <CheckItem text="Custom theme engine for colors & typography" />
              <CheckItem text="Real-time audit logs and security monitoring" />
              <CheckItem text="Bulk user import and permission syncing" />
            </div>
          </div>
          <div className="relative">
            {/* Abstract UI Mockup */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 rotate-2 relative z-10">
              <div className="bg-slate-50 rounded-xl h-64 w-full flex flex-col p-4 border border-slate-200">
                <div className="h-4 w-1/3 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                  <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                  <div className="h-2 w-4/6 bg-slate-200 rounded"></div>
                </div>
                <div className="mt-auto flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary"></div>
                  <div className="h-8 w-8 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
            {/* Decorative back element */}
            <div className="absolute inset-0 bg-primary/10 rounded-3xl -rotate-3 scale-95 z-0"></div>
          </div>
        </div>
      </section>

      {/* =========================================
         SECTION 5: SOCIAL PROOF / TESTIMONIALS
      ========================================= */}
      <section className="py-32 px-6 bg-background relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                Success Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Trusted by the world's <br /> fastest growing{" "}
                <span className="text-primary italic">franchises.</span>
              </h2>
            </div>
            <div className="hidden md:block">
              <button className="flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all">
                Read all case studies <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The level of customization KalpTree offers is unmatched. We managed to stay 100% on-brand while scaling to 40 new locations."
              author="Sarah Jenkins"
              role="CTO @ BuildRight"
              // Image="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=6d455a&color=fff"
            />
            <TestimonialCard
              quote="Security was our top priority. The RBAC architecture here is robust, granular, and incredibly easy to manage globally."
              author="Michael Chen"
              role="Operations Head @ LuxHome"
              // image="https://ui-avatars.com/api/?name=Michael+Chen&background=6d455a&color=fff"
            />
            <TestimonialCard
              quote="Finally, a dashboard that understands architectural aesthetics. It's not just a tool; it's a premium experience for our team."
              author="Elena Rodriguez"
              role="Design Director @ ArchiGroup"
              // Image="https://ui-avatars.com/api/?name=Elena+R&background=6d455a&color=fff"
            />
          </div>
        </div>
      </section>

      {/* =========================================
         SECTION 6: FAQ (Accordion Style)
      ========================================= */}
      <section className="py-32 px-6 bg-muted border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Common Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about the KalpTree Admin ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <FaqItem
              question="How does the White-Labeling work?"
              answer="You can inject your brand's CSS variables directly through the admin panel. Changes reflect instantly across all franchise portals including logos, fonts, and primary colors."
            />
            <FaqItem
              question="Is my data shared between tenants?"
              answer="Never. We use a strict logical isolation layer. Each franchise (tenant) operates in its own secure environment, ensuring zero data leakage."
            />
            <FaqItem
              question="Can I integrate my existing CRM?"
              answer="Yes. Our platform is API-first. You can connect KalpTree with Salesforce, HubSpot, or any custom internal tool using our secure Webhooks and REST API."
            />
            <FaqItem
              question="What kind of support do you offer?"
              answer="Enterprise clients get a dedicated success manager and 24/7 priority technical support via Slack and Email with a guaranteed 2-hour response time."
            />
          </div>

          {/* <div className="mt-16 text-center p-10 bg-primary rounded-[32px] text-primary-foreground">
      <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
      <p className="opacity-80 mb-6">We're here to help you build your enterprise portal.</p>
      <button className="bg-secondary text-primary font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
        Contact Support Team
      </button>
    </div> */}
        </div>
      </section>

      {/* =========================================
         SECTION 7: FINAL CTA (Plum Gradient)
      ========================================= */}
      <section className="pt-20 pb-20  px-6 bg-white">
        <div className="max-w-5xl mx-auto bg-primary rounded-md p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
            Ready to scale your franchise?
          </h2>
          <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto relative z-10 text-lg">
            Join hundreds of high-growth companies using KalpTree to power their
            operations.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLogin}
              className="px-12 py-5 bg-white text-primary rounded-full font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl"
            >
              Get Started Now
            </button>
            <button className="px-12 py-5 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 bg-[#f7f7f7] text-sm">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src="/kalptree-main-logo.svg"
              className="w-32 mb-4 brightness-0 opacity-80"
              alt="Kalptree"
            />
            <p className="text-slate-500">
              The standard for enterprise franchise management.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-900">Product</h4>
            <ul className="space-y-2 text-slate-600">
              <li>Features</li>
              <li>Security</li>
              <li>Enterprise</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-900">Company</h4>
            <ul className="space-y-2 text-slate-600">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-900">Legal</h4>
            <ul className="space-y-2 text-slate-600">
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-400 border-t border-slate-200 pt-8">
          <p>&copy; 2024 KalpTree Inc. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

// =========================================
// HELPER COMPONENTS
// =========================================

function Stat({ item, label }: { item: string; label: string }) {
  return (
    <div className="text-center border-r last:border-0 border-slate-100">
      <div className="text-4xl font-black text-primary font-bold">{item}</div>
      <div className="text-slate-500 text-sm font-medium pt-2">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8 rounded-[24px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6  hover:text-white transition-colors duration-300">
        <div className="hover:text-white transition-colors hover:text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
      <span className="text-foreground/80 font-medium">{text}</span>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left">
      <div className="flex gap-1 mb-4 text-amber-400">
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
      </div>
      <p className="text-slate-600 italic mb-6">"{quote}"</p>
      <div>
        <div className="font-bold text-slate-900">{author}</div>
        <div className="text-xs text-slate-500">{role}</div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
      <h3 className="font-bold text-lg text-foreground mb-2 flex justify-between items-center">
        {question}
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}
