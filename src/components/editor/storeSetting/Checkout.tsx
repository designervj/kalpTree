"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Info } from "lucide-react";

const Checkout = () => {
  // Shopping bag
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Policies
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [refund, setRefund] = useState(false);

  // Marketing consent depends on Privacy Policy
  const marketingDisabled = !privacy;
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  // Custom options
  const [requirePhone, setRequirePhone] = useState(false);
  const [customField, setCustomField] = useState(false);

  // Language
  const [language, setLanguage] = useState("english");

  // If privacy unchecked, also turn off marketing opt-in
  useMemo(() => {
    if (marketingDisabled && marketingOptIn) setMarketingOptIn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketingDisabled]);

  const Section = ({
    title,
    description,
    children,
  }: {
    title: string;
    description?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1220]">
      <div className="px-6 py-0">
        <div className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </div>
        {description ? (
          <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </div>
        ) : null}
      </div>
      <Separator className="bg-slate-200 dark:bg-slate-800" />
      <div className="px-6 py-2">{children}</div>
    </Card>
  );

  const Row = ({
    checked,
    onCheckedChange,
    label,
    help,
    disabled,
  }: {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    label: string;
    help?: boolean;
    disabled?: boolean;
  }) => (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(v) => onCheckedChange(Boolean(v))}
        className={cn(
          "h-5 w-5 rounded-[6px]",
          "data-[state=checked]:bg-violet-600 data-[state=checked]:text-white",
          "border-slate-300 dark:border-slate-700"
        )}
      />
      <Label
        className={cn(
          "text-[15px] font-normal",
          disabled ? "text-slate-400 dark:text-slate-600" : "text-slate-800 dark:text-slate-200"
        )}
      >
        {label}
      </Label>

      {help ? (
        <span
          className={cn(
            "ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full",
            "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
          )}
          title="Info"
        >
          <Info className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#f6f7fb] text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      <div className="mx-auto w-full max-w-[820px] px-5 py-0">
        {/* <div className="text-[34px] font-semibold leading-none">Checkout</div> */}
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <div className="mt-4 space-y-4">
          {/* Shopping bag settings */}
          
          <Section title="Shopping bag settings" >

            <Row
              checked={showSuggestions}
              onCheckedChange={setShowSuggestions}
              label="Show additional product suggestions in shopping bag"
              help
            />
          </Section>

          {/* Checkout policies */}
          <Section
            title="Checkout policies"
            description={
              <>
                Add policies to your website and link them here.{" "}
                <span className="text-violet-600 hover:underline dark:text-violet-300">
                  Learn more
                </span>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  Checkbox with linked policies will be added at the checkout{" "}
                  <span className="inline-flex translate-y-[2px]">
                    <Info className="ml-1 h-3.5 w-3.5" />
                  </span>
                </div>
              </>
            }
          >
            <div className="space-y-3">
              <Row checked={terms} onCheckedChange={setTerms} label="Terms & Conditions" />
              <Row checked={privacy} onCheckedChange={setPrivacy} label="Privacy policy" />
              <Row checked={refund} onCheckedChange={setRefund} label="Refund policy" />
            </div>
          </Section>

          {/* Marketing consent */}
          <Section
            title="Marketing consent"
            description={
              <>
                Let customers subscribe to marketing emails at checkout. Your Privacy Policy must cover how you collect
                and use their data for marketing, and comply with applicable privacy laws.{" "}
                <span className="text-violet-600 hover:underline dark:text-violet-300">
                  Learn more
                </span>
              </>
            }
          >
            <div className="space-y-4">
              <Row
                checked={marketingOptIn}
                onCheckedChange={setMarketingOptIn}
                label="Show opt-in checkbox at checkout"
                help
                disabled={marketingDisabled}
              />

              <div
                className={cn(
                  "rounded-xl px-4 py-3 text-sm",
                  marketingDisabled
                    ? "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
                    : "bg-violet-50 text-slate-600 dark:bg-violet-500/10 dark:text-slate-300"
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full",
                      marketingDisabled
                        ? "bg-white text-slate-500 dark:bg-[#0b1220] dark:text-slate-400"
                        : "bg-white text-violet-600 dark:bg-[#0b1220] dark:text-violet-300"
                    )}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    {marketingDisabled
                      ? "To use this, first add your Privacy Policy under ‘Checkout policies’ above."
                      : "Marketing consent is enabled because a Privacy Policy is selected."}
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* Custom options */}
          <Section title="Custom options">
            <div className="space-y-3">
              <Row
                checked={requirePhone}
                onCheckedChange={setRequirePhone}
                label="Require phone number at checkout"
                help
              />
              <Row
                checked={customField}
                onCheckedChange={setCustomField}
                label="Add a custom field to the checkout"
                help
              />
            </div>
          </Section>

          {/* Store language */}
          <Section
            title="Store language"
            description={
              <>
                This language will be used in the shopping bag, checkout process, and a few product page messages, like
                "In stock" information.
              </>
            }
          >
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                className={cn(
                  "h-14 rounded-md px-5 text-base w-full",
                  "border-slate-200 bg-white",
                  "focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-0",
                  "dark:border-slate-800 dark:bg-[#0b1220]"
                )}
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="croatian">Croatian</SelectItem>
              </SelectContent>
            </Select>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
