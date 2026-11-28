import { File } from 'expo-file-system';
import { SUPABASE_URL } from '../config';
import { getHeaders } from './api';

function getContentType(uri) {
  const extension = uri.split('.').pop().toLowerCase();
  if (extension === 'png') return { contentType: 'image/png', extension: 'png' };
  if (extension === 'webp') return { contentType: 'image/webp', extension: 'webp' };
  return { contentType: 'image/jpeg', extension: 'jpg' };
}

export async function uploadReceipt(localUri, userId) {
  const photoBytes = await new File(localUri).arrayBuffer();
  if (photoBytes.byteLength === 0) {
    throw new Error('Could not read the photo. Please choose it again.');
  }

  const { contentType, extension } = getContentType(localUri);
  const path = `${userId}/${Date.now()}.${extension}`;

  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/receipts/${path}`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': contentType }),
    body: photoBytes,
  });

  if (!response.ok) {
    throw new Error('Could not upload the receipt photo. Please try again.');
  }

  return `${SUPABASE_URL}/storage/v1/object/public/receipts/${path}`;
}