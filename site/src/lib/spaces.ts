// src/lib/spaces.ts
// DigitalOcean Spaces is S3-compatible. We use the AWS SDK to generate
// signed download URLs that expire shortly. The .exe lives in a PRIVATE
// bucket; only signed URLs grant access.

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = import.meta.env.DO_SPACES_REGION ?? "fra1";
const bucket = import.meta.env.DO_SPACES_BUCKET ?? "pumkin-releases";
const accessKey = import.meta.env.DO_SPACES_KEY;
const secret = import.meta.env.DO_SPACES_SECRET;

if (!accessKey || !secret) {
  console.warn("[pumkin] DO_SPACES_KEY / DO_SPACES_SECRET missing");
}

const client = new S3Client({
  region,
  endpoint: `https://${region}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: accessKey ?? "",
    secretAccessKey: secret ?? "",
  },
  forcePathStyle: false,
});

/**
 * Generate a signed URL for the Pumkin installer of a given version.
 * Default expiry: 10 minutes. Buyer clicks, gets 302'd, has 10 min to start
 * downloading; the actual download then completes regardless of expiry.
 *
 * Expects the installer at: releases/Pumkin_{version}_x64-setup.exe
 * (Capital P — that's what Tauri's NSIS bundler produces from productName "Pumkin")
 */
export async function signedInstallerUrl(version: string, expiresInSeconds = 600): Promise<string> {
  const key = `releases/Pumkin_${version}_x64-setup.exe`;
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, cmd, { expiresIn: expiresInSeconds });
}
