// import React, { useState } from "react";
// import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// // Font file types
// const ACCEPTED_FONT_TYPES = {
//   "font/ttf": [".ttf"],
//   "font/otf": [".otf"],
//   "font/woff": [".woff"],
//   "font/woff2": [".woff2"],
//   "application/x-font-ttf": [".ttf"],
//   "application/x-font-otf": [".otf"],
//   "application/font-woff": [".woff"],
//   "application/font-woff2": [".woff2"],
// };

// interface FontFile {
//   file: File;
//   name: string;
//   format: string;
//   url?: string;
//   s3Key?: string;
//   uploadStatus: "idle" | "uploading" | "success" | "error";
//   error?: string;
// }

// interface FontUploadConfig {
//   bucketName: string;
//   region: string;
//   accessKeyId?: string;
//   secretAccessKey?: string;
//   folder?: string;
// }

// interface FontUploaderProps {
//   s3Config: FontUploadConfig;
// }

// export const FontUploader: React.FC<FontUploaderProps> = ({ s3Config }) => {
//   const [fontFile, setFontFile] = useState<FontFile | null>(null);
//   const [customName, setCustomName] = useState("");
//   const [isDragging, setIsDragging] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fontType, setFontType] = useState("heading");

//   const getFontFormat = (fileName: string): string => {
//     const ext = fileName.toLowerCase().split(".").pop();
//     return ext || "unknown";
//   };

//   const getFontFamilyName = (fileName: string): string => {
//     // Remove extension and clean up name
//     return fileName
//       .replace(/\.(ttf|otf|woff|woff2)$/i, "")
//       .replace(/[-_]/g, " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase());
//   };

//   const handleFileSelect = (files: FileList | null) => {
//     if (!files || files.length === 0) return;

//     const file = files[0];
//     const ext = `.${file.name.toLowerCase().split(".").pop()}`;

//     // Validate file type
//     if (!Object.values(ACCEPTED_FONT_TYPES).flat().includes(ext)) {
//       return;
//     }

//     const suggestedName = getFontFamilyName(file.name);

//     setFontFile({
//       file,
//       name: suggestedName,
//       format: getFontFormat(file.name),
//       uploadStatus: "idle",
//     });

//     setCustomName(suggestedName);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     handleFileSelect(e.dataTransfer.files);
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const removeFile = () => {
//     setFontFile(null);
//     setCustomName("");
//   };

//   const uploadToS3 = async (): Promise<void> => {
//     if (!fontFile) return;

//     setFontFile((prev) =>
//       prev ? { ...prev, uploadStatus: "uploading" } : null,
//     );

//     try {
//       // Generate S3 key
//       const timestamp = Date.now();
//       const sanitizedName = fontFile.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
//       const s3Key = s3Config.folder
//         ? `${s3Config.folder}/${timestamp}-${sanitizedName}`
//         : `fonts/${timestamp}-${sanitizedName}`;

//       // Upload to S3
//       const uploadResult = await uploadFileToS3(fontFile.file, s3Key, s3Config);

//       // Update with success
//       setFontFile((prev) =>
//         prev
//           ? {
//               ...prev,
//               uploadStatus: "success",
//               url: uploadResult.url,
//               s3Key: uploadResult.key,
//             }
//           : null,
//       );

//       return;
//     } catch (error) {
//       setFontFile((prev) =>
//         prev
//           ? {
//               ...prev,
//               uploadStatus: "error",
//               error: error instanceof Error ? error.message : "Upload failed",
//             }
//           : null,
//       );
//       throw error;
//     }
//   };

//   const handleSubmit = async () => {
//     if (!fontFile || !customName.trim()) return;

//     setIsSubmitting(true);

//     try {
//       // Upload to S3 if not already uploaded
//       if (fontFile.uploadStatus === "idle") {
//         await uploadToS3();
//       }

//       // After successful upload, call the callback with custom name
//       if (
//         fontFile.url ||
//         (fontFile.uploadStatus === "success" && fontFile.url)
//       ) {
//         const req = await fetch("/api/admin/typography", {
//           method: "POST",
//           body: JSON.stringify({
//             name: customName,
//             key: fontFile.s3Key,
//             url: fontFile.url,
//             fontType: fontType,
//           }),
//         });

//         const res = await req.json();

//         if (res.success) {
//           console.log(res.data);
//         }
//         // Reset form
//         setFontFile(null);
//         setCustomName("");
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const StatusIcon = ({ status }: { status: FontFile["uploadStatus"] }) => {
//     switch (status) {
//       case "uploading":
//         return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
//       case "success":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "error":
//         return <AlertCircle className="h-4 w-4 text-red-500" />;
//       default:
//         return <Upload className="h-4 w-4 text-muted-foreground" />;
//     }
//   };

//   return (
//     <Card>
//       <CardContent className="pt-6 space-y-4">
//         <div>
//           <Label>Upload Custom Font</Label>
//           <p className="text-xs text-muted-foreground mt-1">
//             Supported formats: TTF, OTF, WOFF, WOFF2
//           </p>
//         </div>

//         {/* Drop Zone */}
//         {!fontFile && (
//           <div
//             className={`
//               border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
//               ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
//             `}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onClick={() => {
//               document.getElementById("font-file-input")?.click();
//             }}
//           >
//             <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
//             <p className="text-sm font-medium mb-1">
//               Drop a font file here or click to browse
//             </p>
//             <p className="text-xs text-muted-foreground">
//               Single file upload only
//             </p>
//             <input
//               id="font-file-input"
//               type="file"
//               accept={Object.values(ACCEPTED_FONT_TYPES).flat().join(",")}
//               className="hidden"
//               onChange={(e) => handleFileSelect(e.target.files)}
//             />
//           </div>
//         )}

//         {/* Selected File */}
//         {fontFile && (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
//               <div className="flex items-center gap-3 flex-1 min-w-0">
//                 <StatusIcon status={fontFile.uploadStatus} />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium truncate">
//                     {fontFile.file.name}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {fontFile.format.toUpperCase()} •{" "}
//                     {(fontFile.file.size / 1024).toFixed(1)} KB
//                   </p>
//                   {fontFile.error && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {fontFile.error}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               {fontFile.uploadStatus !== "uploading" && (
//                 <Button variant="ghost" size="sm" onClick={removeFile}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>

//             {/* Font Name Input */}
//             <div className="space-y-2">
//               <Label htmlFor="font-name">Font Name</Label>
//               <Input
//                 id="font-name"
//                 type="text"
//                 placeholder="Enter custom font name"
//                 value={customName}
//                 onChange={(e) => setCustomName(e.target.value)}
//                 disabled={fontFile.uploadStatus === "uploading" || isSubmitting}
//               />
//               <p className="text-xs text-muted-foreground">
//                 This name will be used to reference the font in your application
//               </p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="font-type">Font Type</Label>

//               <Select
//                 value={fontType}
//                 onValueChange={setFontType}
//                 disabled={fontFile.uploadStatus === "uploading" || isSubmitting}
//               >
//                 <SelectTrigger id="font-type">
//                   <SelectValue placeholder="Select font type" />
//                 </SelectTrigger>

//                 <SelectContent>
//                   <SelectItem value="heading">Heading</SelectItem>
//                   <SelectItem value="body">Body</SelectItem>
//                 </SelectContent>
//               </Select>

//               <p className="text-xs text-muted-foreground">
//                 This font will be applied to selected typography styles
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Submit Button */}
//         {fontFile && (
//           <Button
//             className="w-full"
//             onClick={handleSubmit}
//             disabled={
//               !customName.trim() ||
//               fontFile.uploadStatus === "uploading" ||
//               isSubmitting
//             }
//           >
//             {isSubmitting || fontFile.uploadStatus === "uploading" ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 {fontFile.uploadStatus === "uploading"
//                   ? "Uploading..."
//                   : "Submitting..."}
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="mr-2 h-4 w-4" />
//                 Submit Font
//               </>
//             )}
//           </Button>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// // S3 Upload utility function (to be implemented with actual AWS SDK)
// async function uploadFileToS3(
//   file: File,
//   key: string,
//   config: FontUploadConfig,
// ): Promise<{ url: string; key: string }> {
//   // This is a placeholder - implement with actual AWS SDK
//   // Example using AWS SDK v3:

//   const s3Client = new S3Client({
//     region: config.region,
//     credentials: {
//       accessKeyId: config.accessKeyId!,
//       secretAccessKey: config.secretAccessKey!,
//     },
//     requestChecksumCalculation: "WHEN_REQUIRED",
//   });

//   const command = new PutObjectCommand({
//     Bucket: config.bucketName,
//     Key: key,
//     Body: file,
//     ContentType: file.type,
//     // CacheControl: "public, max-age=31536000",
//   });

//   await s3Client.send(command);

//   const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;
//   return { url, key };

//   //   // Simulated upload for demo
//   //   return new Promise((resolve) => {
//   //     setTimeout(() => {
//   //       const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;
//   //       resolve({ url, key });
//   //     }, 2000);
//   //   });
// }

import React, { useState } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Font file types
const ACCEPTED_FONT_TYPES = {
  "font/ttf": [".ttf"],
  "font/otf": [".otf"],
  "font/woff": [".woff"],
  "font/woff2": [".woff2"],
  "application/x-font-ttf": [".ttf"],
  "application/x-font-otf": [".otf"],
  "application/font-woff": [".woff"],
  "application/font-woff2": [".woff2"],
};

interface FontFile {
  file: File;
  name: string;
  format: string;
  url?: string;
  s3Key?: string;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  error?: string;
}

interface FontUploadConfig {
  bucketName: string;
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  folder?: string;
}

interface FontUploaderProps {
  s3Config: FontUploadConfig;
}

export const FontUploader: React.FC<FontUploaderProps> = ({ s3Config }) => {
  const [fontFile, setFontFile] = useState<FontFile | null>(null);
  const [customName, setCustomName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fontType, setFontType] = useState("general");

  const getFontFormat = (fileName: string): string => {
    const ext = fileName.toLowerCase().split(".").pop();
    return ext || "unknown";
  };

  const getFontFamilyName = (fileName: string): string => {
    return fileName
      .replace(/\.(ttf|otf|woff|woff2)$/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const ext = `.${file.name.toLowerCase().split(".").pop()}`;

    if (!Object.values(ACCEPTED_FONT_TYPES).flat().includes(ext)) {
      return;
    }

    const suggestedName = getFontFamilyName(file.name);

    setFontFile({
      file,
      name: suggestedName,
      format: getFontFormat(file.name),
      uploadStatus: "idle",
    });

    setCustomName(suggestedName);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = () => {
    setFontFile(null);
    setCustomName("");
  };

  // Now returns the upload result directly so handleSubmit doesn't have to read from state
  const uploadToS3 = async (): Promise<{ url: string; key: string }> => {
    if (!fontFile) throw new Error("No file selected");

    setFontFile((prev) =>
      prev ? { ...prev, uploadStatus: "uploading" } : null,
    );

    try {
      const timestamp = Date.now();
      const sanitizedName = fontFile.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const s3Key = s3Config.folder
        ? `${s3Config.folder}/${timestamp}-${sanitizedName}`
        : `fonts/${timestamp}-${sanitizedName}`;

      const uploadResult = await uploadFileToS3(fontFile.file, s3Key, s3Config);

      // Update state for UI feedback only
      setFontFile((prev) =>
        prev
          ? {
            ...prev,
            uploadStatus: "success",
            url: uploadResult.url,
            s3Key: uploadResult.key,
          }
          : null,
      );

      // Return directly — don't rely on state being updated yet
      return uploadResult;
    } catch (error) {
      setFontFile((prev) =>
        prev
          ? {
            ...prev,
            uploadStatus: "error",
            error: error instanceof Error ? error.message : "Upload failed",
          }
          : null,
      );
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!fontFile || !customName.trim()) return;

    setIsSubmitting(true);

    try {
      // Single click: upload to S3 and get result in one go
      const { url, key } = await uploadToS3();

      const req = await fetch("/api/admin/typography", {
        method: "POST",
        body: JSON.stringify({
          name: customName,
          key,
          url,
          fontType: fontType,
        }),
      });

      const res = await req.json();

      if (res.success) {
        console.log(res.data);
      }

      // Reset form
      setFontFile(null);
      setCustomName("");
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusIcon = ({ status }: { status: FontFile["uploadStatus"] }) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label>Upload Custom Font</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Supported formats: TTF, OTF, WOFF, WOFF2
          </p>
        </div>

        {/* Drop Zone */}
        {!fontFile && (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              document.getElementById("font-file-input")?.click();
            }}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              Drop a font file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Single file upload only
            </p>
            <input
              id="font-file-input"
              type="file"
              accept={Object.values(ACCEPTED_FONT_TYPES).flat().join(",")}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        )}

        {/* Selected File */}
        {fontFile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <StatusIcon status={fontFile.uploadStatus} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fontFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fontFile.format.toUpperCase()} •{" "}
                    {(fontFile.file.size / 1024).toFixed(1)} KB
                  </p>
                  {fontFile.error && (
                    <p className="text-xs text-red-500 mt-1">
                      {fontFile.error}
                    </p>
                  )}
                </div>
              </div>
              {fontFile.uploadStatus !== "uploading" && (
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Font Name Input */}
            <div className="space-y-2">
              <Label htmlFor="font-name">Font Name</Label>
              <Input
                id="font-name"
                type="text"
                placeholder="Enter custom font name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                disabled={fontFile.uploadStatus === "uploading" || isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                This name will be used to reference the font in your application
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-type">Font Type</Label>

              <Select
                value={fontType}
                onValueChange={setFontType}
                disabled={fontFile.uploadStatus === "uploading" || isSubmitting}
              >
                <SelectTrigger id="font-type">
                  <SelectValue placeholder="Select font type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="heading">Heading</SelectItem>
                  <SelectItem value="body">Body</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                This font will be applied to selected typography styles
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {fontFile && (
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              !customName.trim() ||
              fontFile.uploadStatus === "uploading" ||
              isSubmitting
            }
          >
            {isSubmitting || fontFile.uploadStatus === "uploading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {fontFile.uploadStatus === "uploading"
                  ? "Uploading..."
                  : "Submitting..."}
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Font
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

async function uploadFileToS3(
  file: File,
  key: string,
  config: FontUploadConfig,
): Promise<{ url: string; key: string }> {
  const s3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId!,
      secretAccessKey: config.secretAccessKey!,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
  });

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: file,
    ContentType: file.type,
  });

  await s3Client.send(command);

  const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;
  return { url, key };
}
