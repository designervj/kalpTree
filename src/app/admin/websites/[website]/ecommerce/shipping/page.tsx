"use client";

import React, { useEffect, useState } from "react";
import {
  Truck,
  Map,
  Box,
  Plus,
  Trash2,
  Edit2,
  X,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ZodIntersection } from "zod";
import { ObjectId } from "mongodb";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

const COUNTRIES_WITH_STATES = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  "United States": [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "District of Columbia",
    "Puerto Rico",
    "Guam",
    "U.S. Virgin Islands",
    "American Samoa",
    "Northern Mariana Islands",
  ],
  Canada: [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ],
  Australia: [
    "New South Wales",
    "Victoria",
    "Queensland",
    "Western Australia",
    "South Australia",
    "Tasmania",
    "Australian Capital Territory",
    "Northern Territory",
  ],
};

export type Country = keyof typeof COUNTRIES_WITH_STATES;

const OTHER_COUNTRIES: string[] = [
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Mexico",
  "China",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
];

export interface Location {
  country: string;
  states: string[];
}

export interface Rates {
  name: string;
  price: number;
  conditions: any;
}

export interface Zone {
  _id?: string;
  name: string;
  locations: Location[];
  rates: Rates[];
}

export default function ShippingPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);

  const [packageDimensions, setPackageDimensions] = useState({
    length: "30",
    width: "20",
    height: "10",
    weight: "0.5",
  });

  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<null | number>(null);
  const [editingRate, setEditingRate] = useState<null | number>(null);

  const [zoneForm, setZoneForm] = useState<Zone>({
    name: "",
    locations: [],
    rates: [],
  });

  const [rateForm, setRateForm] = useState({
    name: "",
    price: "",
    showConditions: false,
    conditionType: "weight",
    minValue: "",
    maxValue: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [showStateSelector, setShowStateSelector] = useState<Boolean>(false);

  const openZoneDialog = (zone?: null | Zone, index?: number) => {
    if (zone && index != null) {
      setEditingZone(index);
      setZoneForm({
        name: zone.name,
        locations: JSON.parse(JSON.stringify(zone.locations)),
        rates: JSON.parse(JSON.stringify(zone.rates)),
      });
    } else {
      setEditingZone(null);
      setZoneForm({
        name: "",
        locations: [],
        rates: [],
      });
    }
    setIsZoneDialogOpen(true);
  };

  const closeZoneDialog = () => {
    setIsZoneDialogOpen(false);
    setEditingZone(null);
    setZoneForm({ name: "", locations: [], rates: [] });
    setSelectedCountry("");
    setSelectedStates([]);
    setShowStateSelector(false);
  };

  const openRateDialog = (rate?: Rates | null, index?: number) => {
    if (rate && index !== null && index != undefined) {
      setEditingRate(index);
      const condition = rate.conditions?.[0];
      setRateForm({
        name: rate.name,
        price: rate.price.toString(),
        showConditions: condition ? true : false,
        conditionType: condition ? condition.type : "weight",
        minValue: condition?.minValue || "",
        maxValue: condition?.maxValue || "",
      });
    } else {
      setEditingRate(null);
      setRateForm({
        name: "",
        price: "",
        showConditions: false,
        conditionType: "weight",
        minValue: "",
        maxValue: "",
      });
    }
    setIsRateDialogOpen(true);
  };

  const closeRateDialog = () => {
    setIsRateDialogOpen(false);
    setEditingRate(null);
    setRateForm({
      name: "",
      price: "",
      showConditions: false,
      conditionType: "weight",
      minValue: "",
      maxValue: "",
    });
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    if (COUNTRIES_WITH_STATES[country]) {
      setSelectedStates(COUNTRIES_WITH_STATES[country]);
      setShowStateSelector(true);
    } else {
      setSelectedStates([]);
      setShowStateSelector(false);
      addLocationToZone(country, []);
    }
  };

  const toggleAllStates = (country: Country) => {
    const allStates = COUNTRIES_WITH_STATES[country];
    if (selectedStates.length === allStates.length) {
      setSelectedStates([]);
    } else {
      setSelectedStates(allStates);
    }
  };

  const toggleState = (state: string) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter((s) => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };

  const addLocationToZone = (country: string, states: string[]) => {
    const existing = zoneForm.locations.findIndex((l) => l.country === country);
    if (existing >= 0) {
      const updated = [...zoneForm.locations];
      updated[existing] = { country, states };
      setZoneForm({ ...zoneForm, locations: updated });
    } else {
      setZoneForm({
        ...zoneForm,
        locations: [...zoneForm.locations, { country, states }],
      });
    }
    setSelectedCountry("");
    setSelectedStates([]);
    setShowStateSelector(false);
  };

  const confirmStateSelection = () => {
    if (selectedCountry && selectedStates.length > 0) {
      addLocationToZone(selectedCountry, selectedStates);
    }
  };

  const removeLocation = (index: number) => {
    setZoneForm({
      ...zoneForm,
      locations: zoneForm.locations.filter((_, i) => i !== index),
    });
  };

  const saveRate = () => {
    if (!rateForm.name || rateForm.price === "") {
      alert("Please fill in rate name and price");
      return;
    }

    const rate = {
      name: rateForm.name,
      price: parseFloat(rateForm.price),
      conditions: rateForm.showConditions
        ? [
          {
            type: rateForm.conditionType,
            minValue: rateForm.minValue,
            maxValue: rateForm.maxValue,
          },
        ]
        : [],
    };

    if (editingRate != null) {
      setZoneForm({
        ...zoneForm,
        rates: zoneForm.rates.map((r, index) =>
          index === editingRate ? rate : r,
        ),
      });
    } else {
      setZoneForm({
        ...zoneForm,
        rates: [...zoneForm.rates, rate],
      });
    }
    closeRateDialog();
  };

  const removeRate = (rateId: number) => {
    setZoneForm({
      ...zoneForm,
      rates: zoneForm.rates.filter((r, index) => index !== rateId),
    });
  };

  const saveZone = async () => {
    if (
      !zoneForm.name ||
      zoneForm.locations.length === 0 ||
      zoneForm.rates.length === 0
    ) {
      alert("Please fill in zone name, add locations and rates");
      return;
    }
    try {
      if (editingZone != null) {
        const zone = zones.find((d, index) => index == editingZone);
        const req = await fetch(
          `/api/admin/ecommerce/shipping?websiteId=${currentWebsite?._id}&tenantId=${currentWebsite?.tenantId}&id=${zone?._id}`,
          {
            method: "PUT",
            body: JSON.stringify(zoneForm),
          },
        );
        const res = await req.json();
        if (res.success) {
          toast.success(res.message);
          setZones(
            zones.map((z, index) =>
              index === editingZone ? { ...z, ...zoneForm } : z,
            ),
          );
        }
      } else {
        const req = await fetch(
          `/api/admin/ecommerce/shipping?websiteId=${currentWebsite?._id}&tenantId=${currentWebsite?.tenantId}`,
          {
            method: "POST",
            body: JSON.stringify(zoneForm),
          },
        );
        const res = await req.json();

        if (res.success) {
          setZones([...zones, res.data]);
        }
      }
      closeZoneDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteZone = (index: number) => {
    if (confirm("Are you sure you want to delete this shipping zone?")) {
      setZones(zones.filter((z, idx) => index !== idx));
    }
  };

  const getLocationDisplay = (locations: Location[]) => {
    return locations
      .map((loc) => {
        if (loc.states.length === 0) {
          return loc.country;
        }
        const main = loc.country as Country;
        const allStates = COUNTRIES_WITH_STATES[main];
        if (loc.states.length === allStates.length) {
          return loc.country;
        }
        return `${loc.country} (${loc.states.length} of ${allStates.length} states)`;
      })
      .join(", ");
  };

  const allCountries = [
    ...Object.keys(COUNTRIES_WITH_STATES),
    ...OTHER_COUNTRIES,
  ];
  const availableCountries = allCountries.filter(
    (country) => !zoneForm.locations.some((l) => l.country === country),
  );

  const handleEditStates = (country: Country) => {
    const location = zoneForm.locations.find((d) => d.country == country);
    if (location) {
      setSelectedCountry(country);
      if (COUNTRIES_WITH_STATES[country]) {
        setSelectedStates(location.states);
        setShowStateSelector(true);
      }
    }
  };

  useEffect(() => {
    if (currentWebsite?._id) {
      (async () => {
        try {
          const req = await fetch(
            `/api/admin/ecommerce/shipping?websiteId=${currentWebsite?._id}&tenantId=${currentWebsite?.tenantId}`,
          );
          const res = await req.json();

          if (res.success) {
            setZones(res.data);
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        } catch (error) {
          toast.error(String(error));
        }
      })();
    }
  }, [currentWebsite]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 p-6">
      <div>
        {/* <h1 className="text-2xl font-semibold tracking-tight">
          Shipping & Delivery
        </h1> */}
        <BreadCrumbPage />

        <p className="text-muted-foreground">
          Manage where you ship and how much you charge.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" /> Shipping Zones
              </CardTitle>
              <CardDescription>
                Rates are calculated based on customer address.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => openZoneDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Create Zone
            </Button>
          </CardHeader>
          <CardContent className="space-y-0 divide-y">
            {zones.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No shipping zones configured. Create one to get started.
              </div>
            ) : (
              zones.map((zone, index) => (
                <div
                  key={index}
                  className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      {zone.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {getLocationDisplay(zone.locations)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    {zone.rates.map((rate, idx) => (
                      <span
                        key={idx}
                        className={
                          rate.price === 0
                            ? "font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {rate.name}:{" "}
                        {rate.price === 0
                          ? "Free"
                          : `$${rate.price.toFixed(2)}`}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openZoneDialog(zone, index)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteZone(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="w-5 h-5" /> Standard Package
            </CardTitle>
            <CardDescription>
              Used to calculate shipping rates at checkout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Length (cm)</Label>
                <Input
                  placeholder="30"
                  value={packageDimensions.length}
                  onChange={(e) =>
                    setPackageDimensions({
                      ...packageDimensions,
                      length: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Width (cm)</Label>
                <Input
                  placeholder="20"
                  value={packageDimensions.width}
                  onChange={(e) =>
                    setPackageDimensions({
                      ...packageDimensions,
                      width: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input
                  placeholder="10"
                  value={packageDimensions.height}
                  onChange={(e) =>
                    setPackageDimensions({
                      ...packageDimensions,
                      height: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  placeholder="0.5"
                  value={packageDimensions.weight}
                  onChange={(e) =>
                    setPackageDimensions({
                      ...packageDimensions,
                      weight: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Dialog */}
      <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingZone != null ? "Edit" : "Create"} Shipping Zone
            </DialogTitle>
            <DialogDescription>
              Configure locations and shipping rates for this zone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Zone Name *</Label>
              <Input
                placeholder="e.g., Domestic, International, Premium Zones"
                value={zoneForm.name}
                onChange={(e) =>
                  setZoneForm({ ...zoneForm, name: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                This name will be visible to your clients
              </p>
            </div>

            <div className="space-y-2">
              <Label>Countries *</Label>

              {!showStateSelector ? (
                <Select
                  onValueChange={handleCountrySelect}
                  value={selectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add country" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedCountry}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowStateSelector(false);
                        setSelectedCountry("");
                        setSelectedStates([]);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedStates.length ===
                        COUNTRIES_WITH_STATES[selectedCountry as Country]
                          ?.length
                      }
                      onCheckedChange={() =>
                        toggleAllStates(selectedCountry as Country)
                      }
                    />
                    <Label
                      htmlFor="select-all"
                      className="font-medium cursor-pointer"
                    >
                      Select all states ({selectedStates.length} of{" "}
                      {
                        COUNTRIES_WITH_STATES[selectedCountry as Country]
                          ?.length
                      }{" "}
                      selected)
                    </Label>
                  </div>

                  <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-2">
                    {COUNTRIES_WITH_STATES[selectedCountry as Country]?.map(
                      (state) => (
                        <div
                          key={state}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={state}
                            checked={selectedStates.includes(state)}
                            onCheckedChange={() => toggleState(state)}
                          />
                          <Label
                            htmlFor={state}
                            className="cursor-pointer text-sm"
                          >
                            {state}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>

                  <Button
                    onClick={confirmStateSelection}
                    disabled={selectedStates.length === 0}
                    className="w-full"
                  >
                    Add {selectedCountry}
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {zoneForm.locations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-md text-sm"
                  >
                    <span className="font-medium">{location.country}</span>
                    {location.states.length > 0 && (
                      <span
                        onClick={() =>
                          handleEditStates(location.country as Country)
                        }
                        className="text-muted-foreground"
                      >
                        {`${location.states.length} of ${COUNTRIES_WITH_STATES[location.country as Country]?.length} states`}
                      </span>
                    )}
                    <button
                      onClick={() => removeLocation(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Shipping Rates *</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openRateDialog()}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Rate
                </Button>
              </div>

              <div className="space-y-2">
                {zoneForm.rates.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                    No rates added yet. Click "Add Rate" to create one.
                  </p>
                ) : (
                  zoneForm.rates.map((rate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-secondary px-4 py-3 rounded-md"
                    >
                      <div>
                        <span className="font-medium">{rate.name}</span>
                        <span className="text-muted-foreground ml-2">
                          {rate.price === 0
                            ? "Free"
                            : `$${rate.price.toFixed(2)}`}
                        </span>
                        {rate.conditions.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {rate.conditions[0].type === "weight"
                              ? "Weight"
                              : "Price"}
                            : {rate.conditions[0].minValue || "0"} -{" "}
                            {rate.conditions[0].maxValue || "∞"}{" "}
                            {rate.conditions[0].type === "weight" ? "kg" : "$"}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openRateDialog(rate, index)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <button
                          onClick={() => removeRate(index)}
                          className="hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeZoneDialog}>
              Cancel
            </Button>
            <Button onClick={saveZone}>
              {editingZone != null ? "Update" : "Save"} Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rate Dialog */}
      <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRate ? "Edit" : "Add"} Shipping Option
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                placeholder="e.g., Standard shipping"
                value={rateForm.name}
                onChange={(e) =>
                  setRateForm({ ...rateForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Shipping rate *</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={rateForm.price}
                  onChange={(e) =>
                    setRateForm({ ...rateForm, price: e.target.value })
                  }
                />
                {rateForm.price === "0" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600 font-medium">
                    Free
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {!rateForm.showConditions ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setRateForm({ ...rateForm, showConditions: true })
                  }
                  className="text-purple-600"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add conditions
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setRateForm({
                        ...rateForm,
                        showConditions: false,
                        minValue: "",
                        maxValue: "",
                      })
                    }
                    className="text-purple-600"
                  >
                    <X className="w-4 h-4 mr-1" /> Remove conditions
                  </Button>

                  <div className="space-y-2">
                    <Label>Condition type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={
                          rateForm.conditionType === "price"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          if (editingRate != null) {
                          } else {
                            setRateForm({
                              ...rateForm,
                              conditionType: "price",
                            });
                          }
                        }}
                        className="justify-start"
                      >
                        <Lock className="w-4 h-4 mr-2" /> Order price
                      </Button>
                      <Button
                        type="button"
                        variant={
                          rateForm.conditionType === "weight"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setRateForm({ ...rateForm, conditionType: "weight" })
                        }
                        className="justify-start"
                      >
                        <Box className="w-4 h-4 mr-2" /> Order weight
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Minimum order {rateForm.conditionType}</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={rateForm.minValue}
                          onChange={(e) =>
                            setRateForm({
                              ...rateForm,
                              minValue: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum order {rateForm.conditionType}</Label>
                        <Input
                          type="text"
                          placeholder="And up"
                          value={rateForm.maxValue}
                          onChange={(e) =>
                            setRateForm({
                              ...rateForm,
                              maxValue: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The lower bound of the condition is inclusive, and the
                      upper bound is not, so you should set conditions according
                      to this example:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>
                        • 0 {rateForm.conditionType === "weight" ? "oz" : "$"} –
                        5 {rateForm.conditionType === "weight" ? "oz" : "$"}
                      </li>
                      <li>
                        • 5 {rateForm.conditionType === "weight" ? "oz" : "$"} –
                        10 {rateForm.conditionType === "weight" ? "oz" : "$"}
                      </li>
                      <li>
                        • 10 {rateForm.conditionType === "weight" ? "oz" : "$"}{" "}
                        – and up
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeRateDialog}>
              Cancel
            </Button>
            <Button onClick={saveRate}>
              {editingRate != null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
