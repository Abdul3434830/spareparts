import { upload } from "@vercel/blob/client";
import imageCompression from "browser-image-compression";

export interface UploadedImageResult {
  url: string;
  pathname: string;
  contentType: string;
}

export async function compressAndUploadImage(
  file: File,
  folder: string = "products"
): Promise<UploadedImageResult> {
  // 1. Validation
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload JPEG, PNG, or WebP images.");
  }

  // 2. Client-side compression to WebP (max 1600px width/height, quality 0.85)
  const options = {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  };

  let processedFile: File;
  try {
    const compressedBlob = await imageCompression(file, options);
    const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    processedFile = new File([compressedBlob], cleanFileName, {
      type: "image/webp",
    });
  } catch (error) {
    console.warn("Compression failed, uploading original file:", error);
    processedFile = file;
  }

  // 3. Direct upload to Vercel Blob using admin token endpoint
  const pathname = `${folder}/${Date.now()}-${processedFile.name}`;
  const blob = await upload(pathname, processedFile, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType,
  };
}
