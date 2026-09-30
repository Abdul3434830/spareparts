import { put, del, list } from "@vercel/blob";

export interface StorageProvider {
  upload(pathname: string, body: Blob | Buffer | string, options?: { access: "public" }): Promise<{ url: string }>;
  delete(url: string | string[]): Promise<void>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ blobs: { url: string; pathname: string }[] }>;
}

export class VercelBlobStorageProvider implements StorageProvider {
  async upload(
    pathname: string,
    body: Blob | Buffer | string,
    options: { access: "public" } = { access: "public" }
  ): Promise<{ url: string }> {
    const blob = await put(pathname, body, {
      access: options.access,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url };
  }

  async delete(url: string | string[]): Promise<void> {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  }

  async list(options?: { prefix?: string; limit?: number }) {
    const response = await list({
      prefix: options?.prefix,
      limit: options?.limit,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return {
      blobs: response.blobs.map((b) => ({
        url: b.url,
        pathname: b.pathname,
      })),
    };
  }
}

export const storage: StorageProvider = new VercelBlobStorageProvider();
