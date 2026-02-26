export type MediaTab = "my" | "images" | "ai" | "docs";

export interface MediaItem {
  id: string;
  folderId: string;
  name: string;
  ext: "PNG" | "JPG" | "PDF" | "DOC";
  kind: "image" | "doc";
  src: string;
  sizeKb?: number;
  uploadedOn?: string;
  uploadedBy?: string;
  mimeType?: string;
};

export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
}