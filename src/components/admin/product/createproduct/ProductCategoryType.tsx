import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const ProductCategoryTypeModal = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  newCategory,
  setNewCategory,
  fieldErrors,
  isSaving,
  handleSaveAdd,
  listProductType,
  setFieldErrors,
}: any) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Industry Type</DialogTitle>
        </DialogHeader>
        {newCategory && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product_type">Product Type *</Label>
              <Select
                value={newCategory.product_type}
                onValueChange={(value) =>
                  setNewCategory({ ...newCategory, product_type: value })
                }
              >
                <SelectTrigger
                  className={fieldErrors.product_type ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {listProductType.map((pt: any) => (
                    <SelectItem key={pt._id} value={pt._id!}>
                      {pt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.product_type && (
                <p className="text-sm text-red-500">
                  {fieldErrors.product_type}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Enter Industry name"
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
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder="industry-slug"
                className={fieldErrors.slug ? "border-red-500" : ""}
              />
              {fieldErrors.slug && (
                <p className="text-sm text-red-500">{fieldErrors.slug}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={newCategory.icon || ""}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, icon: e.target.value })
                }
                placeholder="Icon name or URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={newCategory.sort_order || 0}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    sort_order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCategory.description || ""}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewCategory(null);
                  setFieldErrors({});
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAdd} disabled={isSaving}>
                {isSaving ? "Saving..." : "Add Category"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
