import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ProductTypeModal = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  newProductType,
  setNewProductType,
  fieldErrors,
  isSaving,
  handleSaveAdd,
  setFieldErrors,
}:any) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Product Type</DialogTitle>
        </DialogHeader>
        {newProductType && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newProductType.name}
                onChange={(e) =>
                  setNewProductType({ ...newProductType, name: e.target.value })
                }
                placeholder="Enter product type name"
                className={fieldErrors.name ? "border-red-500" : ""}
              />
              {fieldErrors.name && (
                <p className="text-sm text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={newProductType.slug}
                onChange={(e) =>
                  setNewProductType({ ...newProductType, slug: e.target.value })
                }
                placeholder="Enter slug (e.g., product-type-name)"
                className={fieldErrors.slug ? "border-red-500" : ""}
              />
              {fieldErrors.slug && (
                <p className="text-sm text-red-500">{fieldErrors.slug}</p>
              )}
              <p className="text-xs text-gray-500">
                URL-friendly version of the name (lowercase, hyphens instead of
                spaces)
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewProductType(null);
                  setFieldErrors({});
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAdd} disabled={isSaving}>
                {isSaving ? "Saving..." : "Add Product Type"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
