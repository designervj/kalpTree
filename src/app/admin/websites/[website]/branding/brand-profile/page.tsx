"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Scaffold Data
const initialProfileData = {
  brandName: "KalpTree",
  tagline: "AI-Powered Architecture & Design",
  description: "KalpTree is the leading platform for visualizing home exteriors using advanced AI material rendering.",
  industry: "Architecture",
  foundedYear: "2023",
  website: "https://KalpTree.com",
  email: "contact@KalpTree.com",
  phone: "+1 (555) 123-4567",
  address: "123 Innovation Dr, Tech City, CA",
  socials: {
    facebook: "KalpTree",
    instagram: "KalpTree_ai",
    linkedin: "KalpTree-inc",
    twitter: "KalpTree_official",
  }
};

export default function BrandProfilePage() {
  const [formData, setFormData] = useState(initialProfileData);

  const handleSave = () => {
    // API call logic here
    console.log("Saving profile...", formData);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Profile</h1>
          <p className="text-muted-foreground">Manage your brand's core identity and contact information.</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              General Information
            </CardTitle>
            <CardDescription>
              The public facing details of your business.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input 
                id="brandName" 
                value={formData.brandName} 
                onChange={(e) => setFormData({...formData, brandName: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline / Slogan</Label>
              <Input 
                id="tagline" 
                value={formData.tagline}
                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select defaultValue={formData.industry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Architecture">Architecture</SelectItem>
                    <SelectItem value="Interior Design">Interior Design</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded">Founded Year</Label>
                <Input 
                  id="founded" 
                  value={formData.foundedYear}
                  onChange={(e) => setFormData({...formData, foundedYear: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">About / Bio</Label>
              <Textarea 
                id="description" 
                className="h-32 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <p className="text-[11px] text-muted-foreground text-right">
                {formData.description.length}/500 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Location */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Contact & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Website URL</Label>
                <Input value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Public Email</Label>
                  <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Headquarters Address</Label>
                <Textarea 
                  className="h-20 resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social Presence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Facebook username" value={formData.socials.facebook} />
              </div>
              <div className="relative">
                <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Instagram username" value={formData.socials.instagram} />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="LinkedIn username" value={formData.socials.linkedin} />
              </div>
              <div className="relative">
                <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="X (Twitter) handle" value={formData.socials.twitter} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}