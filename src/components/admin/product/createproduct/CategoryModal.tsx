import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import CategoryForm from "../../category/forms/CategoryForm";

export const CategoryModal = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  newCategory,
  setNewCategory,
  fieldErrors,
  isSaving,
  handleSaveAdd,
}: any) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        {newCategory && (
          <div className="space-y-4">
            <CategoryForm
              category={newCategory}
              setCategory={(value) => {
                if (typeof value === "function") {
                  setNewCategory((prev: any) => (prev ? value(prev) : prev));
                } else {
                  setNewCategory(value);
                }
              }}
              fieldErrors={fieldErrors}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewCategory(null);
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
