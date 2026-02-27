import { ActionBar, createUsePuck } from "@puckeditor/core";
import { FileJson, Star, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Second Group Actions Component ──────────────────────────────────────────

export function ContainerSecondaryActions({
  handleOpemComponentModal,
  openComponentModel,
}: any) {
  const puck = createUsePuck();
  const { selectedItem, dispatch, appState } = puck((s) => s);
  const [copySuccess, setCopySuccess] = useState("");

  const handleCopyJSON = async () => {
    try {
      if (!selectedItem) return;
      await navigator.clipboard.writeText(JSON.stringify(selectedItem));
      toast.success(
        `${selectedItem.type} - ${selectedItem.props.id} - Copied Successful`,
      );
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleFavorite = () => {
    console.log("Favorite clicked");
  };

  return (
    <>
      <ActionBar.Action onClick={handleCopyJSON} label="Copy JSON">
        <FileJson className="w-4 h-4" />
      </ActionBar.Action>
      <ActionBar.Action onClick={handleFavorite} label="Add Favorite">
        <Star className="w-4 h-4" />
      </ActionBar.Action>
      <ActionBar.Action onClick={handleOpemComponentModal} label="Add Section">
        <PlusCircle className="w-4 h-4" />
      </ActionBar.Action>
    </>
  );
}
