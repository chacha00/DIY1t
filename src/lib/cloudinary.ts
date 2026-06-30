import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageBuffer(
  buffer: Buffer,
  options: { folder: string; publicIdPrefix?: string }
) {
  return new Promise<{ publicId: string; url: string; width: number; height: number }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          public_id: options.publicIdPrefix
            ? `${options.publicIdPrefix}-${Date.now()}`
            : undefined,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
          });
        }
      );
      uploadStream.end(buffer);
    }
  );
}

/**
 * Uploads as a "private" raw resource. Cloudinary blocks public delivery of
 * raw files (PDF/ZIP) by default for security reasons, so PDFs are uploaded
 * private and served only via short-lived signed URLs from
 * `getSignedDownloadUrl` rather than the public `secure_url`.
 */
export async function uploadRawBuffer(
  buffer: Buffer,
  options: { folder: string; publicIdPrefix?: string; format?: string }
) {
  return new Promise<{ publicId: string; url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicIdPrefix ? `${options.publicIdPrefix}-${Date.now()}` : undefined,
        resource_type: "raw",
        type: "private",
        format: options.format,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ publicId: result.public_id, url: result.secure_url });
      }
    );
    uploadStream.end(buffer);
  });
}

/** Generates a short-lived signed download URL for a "private" raw resource. */
export function getSignedDownloadUrl(publicId: string, format: string, expiresInSeconds = 300) {
  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: "raw",
    type: "private",
    attachment: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });
}

export { cloudinary };
