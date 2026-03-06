// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Calendar } from "lucide-react";
// import { toast } from "sonner";

// export default function InventoryModal() {
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     productId: "",
//     variantId: "",
//     date: "",
//     totalUnits: "",
//     bookedUnits: "",
//     priceOverride: "",
//   });

//   const [products, setProducts] = useState([]);

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(
//           `/api/admin/product?websiteId=696729dde1222ee82bdd906d`,
//         );
//         const response = await res.json();

//         if (response.success) {
//           toast.success(response.message);

//           setProducts(response.items);
//         } else {
//           toast.success(response.message);
//         }
//       } catch (error) {
//         toast.error(String(error));
//       }
//     })();
//   }, []);

//   console.log(products);

//   const handleSubmit = () => {
//     // Validate all fields are filled
//     if (
//       !formData.productId ||
//       !formData.variantId ||
//       !formData.date ||
//       !formData.totalUnits ||
//       !formData.bookedUnits ||
//       !formData.priceOverride
//     ) {
//       alert("Please fill in all fields");
//       return;
//     }

//     // Prepare data for database
//     const inventoryData = {
//       productId: formData.productId,
//       variantId: formData.variantId,
//       date: formData.date,
//       totalUnits: parseInt(formData.totalUnits),
//       bookedUnits: parseInt(formData.bookedUnits),
//       priceOverride: parseFloat(formData.priceOverride),
//     };

//     console.log("Inventory data to save:", inventoryData);

//     // Here you would typically make an API call to save to database
//     // Example: await fetch('/api/inventory', { method: 'POST', body: JSON.stringify(inventoryData) })

//     // Reset form and close modal
//     setFormData({
//       productId: "",
//       variantId: "",
//       date: "",
//       totalUnits: "",
//       bookedUnits: "",
//       priceOverride: "",
//     });
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <Calendar className="mr-2 h-4 w-4" />
//           Add Inventory
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Add Inventory Item</DialogTitle>
//           <DialogDescription>
//             Enter the inventory details below. All fields are required.
//           </DialogDescription>
//         </DialogHeader>
//         <div>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="productId">Product ID</Label>
//               <Input
//                 id="productId"
//                 name="productId"
//                 placeholder="696dbbc9ca04c08cafc05970"
//                 value={formData.productId}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="variantId">Variant ID</Label>
//               <Input
//                 id="variantId"
//                 name="variantId"
//                 placeholder="696dbbc9ca04c08cafc05971"
//                 value={formData.variantId}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="date">Date</Label>
//               <Input
//                 id="date"
//                 name="date"
//                 type="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="totalUnits">Total Units</Label>
//                 <Input
//                   id="totalUnits"
//                   name="totalUnits"
//                   type="number"
//                   min="0"
//                   placeholder="10"
//                   value={formData.totalUnits}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="bookedUnits">Booked Units</Label>
//                 <Input
//                   id="bookedUnits"
//                   name="bookedUnits"
//                   type="number"
//                   min="0"
//                   placeholder="4"
//                   value={formData.bookedUnits}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="priceOverride">Price Override</Label>
//               <Input
//                 id="priceOverride"
//                 name="priceOverride"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 placeholder="350.00"
//                 value={formData.priceOverride}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit}>Save Inventory</Button>
//           </DialogFooter>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

export default function InventoryModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    variantId: "",
    date: "",
    totalUnits: "",
    bookedUnits: "",
    priceOverride: "",
  });

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (value: any) => {
    const product = products.find((p) => p._id === value);
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      productId: value,
      variantId: "", // Reset variant when product changes
    }));
  };

  const handleVariantChange = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      variantId: value,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/product?websiteId=696729dde1222ee82bdd906d`,
        );
        const response = await res.json();

        if (response.success) {
          toast.success(response.message);
          setProducts(response.items);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(String(error));
      }
    })();
  }, []);

  const handleSubmit = async () => {
    // Validate all fields are filled
    try {
      if (
        !formData.productId ||
        !formData.variantId ||
        !formData.date ||
        !formData.totalUnits ||
        !formData.bookedUnits ||
        !formData.priceOverride
      ) {
        toast.error("Please fill in all fields");
        return;
      }

      // Prepare data for database
      const inventoryData = {
        productId: formData.productId,
        variantId: formData.variantId,
        date: formData.date,
        totalUnits: parseInt(formData.totalUnits),
        bookedUnits: parseInt(formData.bookedUnits),
        priceOverride: parseFloat(formData.priceOverride),
      };

      const req = await fetch(
        `/api/admin/bookings/calender?websiteId=696729dde1222ee82bdd906d&tenantId=696729dde1222ee82bdd906a`,
        {
          method: "POST",
          body: JSON.stringify(inventoryData),
        },
      );

      const res = await req.json();

      if (res.success) {
        toast.success(res.message);
        setFormData({
          productId: "",
          variantId: "",
          date: "",
          totalUnits: "",
          bookedUnits: "",
          priceOverride: "",
        });
        setSelectedProduct(null);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Enter the inventory details below. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="productId">Product</Label>
              <Select
                value={formData.productId}
                onValueChange={handleProductChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="variantId">Variant</Label>
              <Select
                value={formData.variantId}
                onValueChange={handleVariantChange}
                disabled={!selectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a variant" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct?.variants?.map((variant: any) => {
                    const variantLabel = variant.attributes
                      .map(
                        (attr: any) => `${attr.attributeName}: ${attr.value}`,
                      )
                      .join(", ");
                    return (
                      <SelectItem key={variant._id} value={variant._id}>
                        {variantLabel} - ${variant.price}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalUnits">Total Units</Label>
                <Input
                  id="totalUnits"
                  name="totalUnits"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={formData.totalUnits}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bookedUnits">Booked Units</Label>
                <Input
                  id="bookedUnits"
                  name="bookedUnits"
                  type="number"
                  min="0"
                  placeholder="4"
                  value={formData.bookedUnits}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priceOverride">Price Override</Label>
              <Input
                id="priceOverride"
                name="priceOverride"
                type="number"
                step="0.01"
                min="0"
                placeholder="350.00"
                value={formData.priceOverride}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Inventory</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
