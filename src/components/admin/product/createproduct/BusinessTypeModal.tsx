import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AttributeSetForm from "../../attributessets/forms/AttributeSetsForm";

export const BusinessTypeModal = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  newAttributeSet,
  setNewAttributeSet,
  fieldErrors,
  isSaving,
  handleSaveAdd,
}: any) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Business Type</DialogTitle>
        </DialogHeader>
        {newAttributeSet && (
          <div className="space-y-4">
            <AttributeSetForm
              attributeSet={newAttributeSet}
              setAttributeSet={(value) => {
                if (typeof value === "function") {
                  setNewAttributeSet((prev: any) =>
                    prev ? value(prev) : prev,
                  );
                } else {
                  setNewAttributeSet(value);
                }
              }}
              fieldErrors={fieldErrors}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewAttributeSet(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAdd} disabled={isSaving}>
                {isSaving ? "Saving..." : "Add Attribute Set"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
