"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;

}
  const CreateFolder = ({ isOpen, onClose }: Props) => {
  const [folderName, setFolderName] = useState<string | null>(null)

  const handleCreateFolder = () => {
    if (folderName) {
      // createFolder(folderName)
      setFolderName(null)
      onClose()
    }
  }

  const handleCancel = () => {
    setFolderName(null)
    onClose()
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <Input
            value={folderName != null ? folderName : ""}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder();
            }}
          />
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleCreateFolder}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>


  )
}

export default CreateFolder