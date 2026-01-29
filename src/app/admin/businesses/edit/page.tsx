"use client"
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import BusinessCreatePage from '@/components/admin/users/usercomp'
import { Businessdetails } from '@/components/admin/users/businessdetails'
import { formatBrandSlug } from '@/lib/utils'
import { Briefcase, CheckCircle, Palette, XCircle } from 'lucide-react'
import { Brandingdetails } from '@/components/admin/users/brandingdetails'
import { IBusiness } from '@/models/business'
import { updateBusiness } from '@/hooks/slices/business/BusinessThunk'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { updatePassword } from '@/hooks/slices/user/userSlice'


type business = {
  id: string;
  name: string;
 
  businessdetails: {
     email?: string;
   password?: string;
    business_website_url: string;
    tagline: string;
    industry: string;
    founded_year: string;
    about: string;
    public_email: string;
    phone: string;
    headquarters: string;
    brand_name: string;
    service: string;
  };
  branding: {
    logo: string;
    primary_color: string;
    secondary_color: string;
    tertiary_color: string;
    typography: string;
  };
}
const page = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { editBusiness } = useSelector((state: RootState) => state.business);
  const { curretAgency } = useSelector((state: RootState) => state.agency);


  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(
    "business"
  );
  const [logoPreview, setLogoPreview] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const tabs = [
    { id: "business", label: "Business Details", icon: Briefcase },
    { id: "branding", label: "Branding", icon: Palette },
  ];

  const [formData, setFormData] = useState<business>();

  React.useEffect(() => {
    if (editBusiness != null && curretAgency != null) {
      setFormData((prev: any) => ({
        ...prev,
        businessdetails: {
          email: editBusiness.email,
          password: "",
          service: editBusiness?.businessdetails?.service || "ECOMMERCE",
          business_name: editBusiness?.name,
          business_url: editBusiness?.businessdetails?.business_website_url,
          tagline: editBusiness?.businessdetails?.tagline,
          industry: editBusiness?.businessdetails?.industry,
          founded_year: editBusiness?.businessdetails?.founded_year,
          about: editBusiness?.businessdetails?.about,
          public_email: editBusiness?.businessdetails?.public_email,
          phone: editBusiness?.businessdetails?.phone,
          headquarters: editBusiness?.businessdetails?.headquarters,
          brand_name: editBusiness?.businessdetails?.brand_name,
          lang: ["English"],
        },
        branding: {
          logo: editBusiness?.branding?.logo, // Logo file object cannot be restored, only preview
          primary_color: editBusiness?.branding?.primary_color || "#6366f1",
          secondary_color: editBusiness?.branding?.secondary_color || "#8b5cf6",
          tertiary_color: editBusiness?.branding?.tertiary_color || "#ec4899",
          typography: editBusiness?.branding?.typography || "Inter",
        },
      }));

      // Set logo preview if logo URL exists
      if (editBusiness?.branding?.logo) {
        setLogoPreview(editBusiness.branding.logo);
      }
    }
  }, [editBusiness, curretAgency]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files } = e.target;

    if (name == "businessdetails.brand_name") {
      let newvalu = formatBrandSlug(value);
      console.log(newvalu);
      const cloned = structuredClone(formData);
      // cloned?.businessdetails?.business_url = newvalu;
      // setFormData(cloned);
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
      return;
    }

    // if (name === "agency_name") {
    //   if (!/^[a-zA-Z0-9 ]*$/.test(value)) return;

    //   setFormData((prev: any) => ({
    //     ...prev,
    //     agency_name: value,
    //     agency_url_suffix: slugify(value),
    //   }));
    //   return;
    // }

    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setFormData((prev: any) => ({
          ...prev,
          branding: {
            ...prev.branding,
            logo: file,
          },
        }));

        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      }
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dispatch = useDispatch<AppDispatch>();
  const handleEditSubmit = async () => {
    setIsSubmitting(true);

  if(!editBusiness?._id){
    toast.error("Business Id not found");
    return;
  }

    const data:IBusiness = {
      ...editBusiness,
      name: formData?.name,
   
      // password: formData?.businessdetails?.password,
      businessdetails: {
        business_website_url: formData?.businessdetails.business_website_url,
        tagline: formData?.businessdetails.tagline,
        industry: formData?.businessdetails.industry,
        founded_year: formData?.businessdetails.founded_year,
        about: formData?.businessdetails.about,
        public_email: formData?.businessdetails.public_email,
        phone: formData?.businessdetails.phone,
        headquarters: formData?.businessdetails.headquarters,
        brand_name: formData?.businessdetails.brand_name,
        service: formData?.businessdetails.service,
      },
      branding: {
        primary_color: formData?.branding.primary_color,
        secondary_color: formData?.branding.secondary_color,
        tertiary_color: formData?.branding.tertiary_color,
        typography: formData?.branding.typography,
        logo: formData?.branding.logo,
      }
    }
   
     const response = await  dispatch(updateBusiness({businessId:(editBusiness?._id)?.toString() ,input:data, password:formData?.businessdetails?.password})).unwrap()

     const responsePassword = await  dispatch(updatePassword({email:editBusiness?.email! ,password:formData?.businessdetails?.password!})).unwrap()
        console.log("update password", responsePassword)  
     if(response && response.success){

        toast.success("Business updated successfully")
        redirect(`/admin/businesses`)
       }else{
        toast.error("Business updated failed")
       }
  };

  return (
    <>
      <div className="bg-white rounded-md  overflow-hidden border border-primary-100">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all relative ${activeTab === tab.id
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-8">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
                }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          )}



          {activeTab === "business" && (
            <Businessdetails
              handleInputChange={handleInputChange}
              formData={formData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              user={user}
              agencies={[curretAgency]}
            />
          )}

          {activeTab === "branding" && (
            <Brandingdetails
              handleInputChange={handleInputChange}
              formData={formData}
              logoPreview={logoPreview}
            />
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                const idx = tabs.findIndex((t) => t.id === activeTab);
                if (idx > 0) setActiveTab(tabs[idx - 1].id);
              }}
              disabled={activeTab === tabs[0].id}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Previous
            </button>

            <div className="flex gap-3">
              {activeTab === "branding" ? (
                <button
                  onClick={handleEditSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 disabled:from-primary-400 disabled:to-purple-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  {isSubmitting ? "Updating Account..." : "Update Account"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    const idx = tabs.findIndex((t) => t.id === activeTab);
                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                  }}
                  className="px-8 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page