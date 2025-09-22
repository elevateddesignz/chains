import { apiFetch } from './api-client';

interface SignedUrlResponse {
  uploadUrl: string;
  key: string;
  headers?: Record<string, string>;
}

export async function uploadFileToApi(file: File): Promise<string> {
  const { uploadUrl, key, headers } = await apiFetch<SignedUrlResponse>('/uploads/sign', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      ...(headers ?? {}),
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file to storage provider');
  }

  return key;
}
