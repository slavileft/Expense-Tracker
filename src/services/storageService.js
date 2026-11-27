import { SUPABASE_URL } from '../config';
import { getHeaders } from './api';

export async function uploadReceipt(localUri, userId) {
  const fileResponse = await fetch(localUri);
  const blob = await fileResponse.blob();

  const contentType = blob.type || 'image/jpeg';
  const extension = contentType.split('/')[1] || 'jpg';
  const path = `${userId}/${Date.now()}.${extension}`;

  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/receipts/${path}`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': contentType }),
    body: blob,
  });

  if (!response.ok) {
    throw new Error('Could not upload the receipt photo. Please try again.');
  }

  return `${SUPABASE_URL}/storage/v1/object/public/receipts/${path}`;
}
