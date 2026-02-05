export function AddProduct() {
  const [step, setStep] = React.useState<"choose" | "form">("choose");
  const [picked, setPicked] = React.useState<SellType | null>(null);

  const cards: Record<SellType, TypeCard> = {
    physical: {
      key: "physical",
      title: "Physical product",
      desc: "Products that require shipping or pick up",
      icon: Box,
    },
    multi_physical: {
      key: "multi_physical",
      title: "Multiple physical products",
      desc: "Add up to 10 physical product at once using AI",
      icon: Sparkles,
    },
    digital: {
      key: "digital",
      title: "Digital product",
      desc: "Products that could be downloaded via link after purchase",
      icon: DownloadCloud,
    },
    service: {
      key: "service",
      title: "Service",
      desc: "Offer your expertise or abilities as a product",
      icon: BadgeCheck,
    },
    appointment: {
      key: "appointment",
      title: "Appointment",
      desc: "Services, that require date & time selection, before going to checkout",
      icon: CalendarDays,
    },
    donation: {
      key: "donation",
      title: "Donation",
      desc: "Collect donations for your campaign here",
      icon: Heart,
    },
    gift_card: {
      key: "gift_card",
      title: "Gift card",
      desc: "Prepaid cards that can be redeemed for store purchases",
      icon: Gift,
      badge: { text: "Beta", tone: "beta" },
    },
    print_on_demand: {
      key: "print_on_demand",
      title: "Print on demand product",
      desc: "Create a product with your custom design",
      icon: Shirt,
      badge: { text: "New", tone: "new" },
    },
  };

  const rows: [TypeCard, TypeCard][] = [
    [cards.physical, cards.multi_physical],
    [cards.digital, cards.service],
    [cards.appointment, cards.donation],
    [cards.gift_card, cards.print_on_demand],
  ];

  const pickType = (k: SellType) => {
    setPicked(k);
    setStep("form");
  };

  const backToChoose = () => {
    setStep("choose");
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // reset
          setStep("choose");
          setPicked(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-sm">Add product</Button>
      </DialogTrigger>

      <DialogContent className="w-[1200px] min-w-[1000px] overflow-hidden rounded-2xl border-slate-200 p-0 shadow-xl">
        {/* Step: Choose type */}
        {step === "choose" ? (
          <div className="bg-white">
            <div className="px-8 pb-4 py-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">
                What do you want to sell?
              </h2>

              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="rounded-full w-8 h-8 cursor-pointer"
                >
                  <IoClose />
                </Button>
              </DialogClose>
            </div>

            <div className="px-8 pb-8">
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="px-6 py-6">
                  <div className="space-y-6">
                    {rows.map((pair, idx) => (
                      <div key={idx} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <OptionCard item={pair[0]} onPick={pickType} />
                          <OptionCard item={pair[1]} onPick={pickType} />
                        </div>
                        {idx !== rows.length - 1 ? <DividerRow /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  {picked ? `Selected: ${picked}` : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Step: Form mock (scrollable)
          <div className="max-h-[85vh] overflow-auto">
            <GetAllcategory />
            <GetAllAttribute />
            <GetAllProductTypeCategory />
            <GetAllAttributesSets />
            <ProductFormMock onBack={backToChoose} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
