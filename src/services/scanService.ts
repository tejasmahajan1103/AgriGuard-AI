// ============================================================
// AgriGuard AI — Scan & S3 Upload Service
// AWS API Gateway + AgriGuardBackend Lambda + S3 Integration
// ============================================================

import { UPLOAD_API_URL } from '../config/upload';
import { cognitoAuth } from './cognitoAuth';
import { mockScans } from '../data/mockData';
import type { CropScan, ScanResult, UploadUrlResponse, UploadImageResult } from '../types';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Retrieve the active Cognito idToken, refreshing if expired
 */
async function getValidIdToken(): Promise<string> {
  const tokens = cognitoAuth.getStoredTokens();

  if (!tokens || !tokens.idToken) {
    throw new Error('Authentication required. Please sign in to upload crop images.');
  }

  // If token is expired or about to expire in 30s, attempt refresh
  if (tokens.expiresAt && tokens.expiresAt - Date.now() < 30_000) {
    if (tokens.refreshToken) {
      try {
        const refreshed = await cognitoAuth.refreshSession(tokens.refreshToken);
        return refreshed.idToken;
      } catch {
        cognitoAuth.clearStoredTokens();
        throw new Error('Your session has expired. Please sign in again.');
      }
    } else {
      throw new Error('Your session has expired. Please sign in again.');
    }
  }

  return tokens.idToken;
}

export const scanService = {
  /**
   * Validate image file format (JPEG, PNG, WebP) and size
   */
  validateImage(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'No file selected.' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error: 'Unsupported image format. Please select a JPEG, PNG, or WebP image.',
      };
    }

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE_BYTES) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit. Please choose a smaller image.',
      };
    }

    return { isValid: true };
  },

  /**
   * Request presigned S3 PUT URL from AWS API Gateway
   */
  async getUploadUrl(fileName: string, contentType: string): Promise<UploadUrlResponse> {
    const idToken = await getValidIdToken();

    let response: Response;
    try {
      response = await fetch(UPLOAD_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          contentType,
        }),
      });
    } catch {
      throw new Error('Unable to connect to the upload service. Please check your network connection.');
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized. Your session may be invalid or expired. Please sign in again.');
      }

      let errorMessage = 'Failed to obtain upload authorization from server.';
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // use default error message
      }

      throw new Error(errorMessage);
    }

    const data: UploadUrlResponse = await response.json();
    if (!data || !data.uploadUrl || !data.key) {
      throw new Error('Invalid response received from upload service.');
    }

    return data;
  },

  /**
   * Upload image file directly to AWS S3 using presigned PUT URL
   */
  async uploadImageToS3(file: File): Promise<UploadImageResult> {
    // 1. Validate file
    const validation = this.validateImage(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // 2. Obtain presigned URL from backend
    const { uploadUrl, key, expiresIn } = await this.getUploadUrl(file.name, file.type);

    // 3. Perform direct HTTP PUT to S3
    let s3Response: Response;
    try {
      s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
    } catch {
      throw new Error('Failed to upload image to S3. Please check your network connection.');
    }

    if (!s3Response.ok) {
      throw new Error(`S3 upload failed with status ${s3Response.status}. Please check your connection and try again.`);
    }

    return {
      key,
      expiresIn,
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };
  },

  async getScans(): Promise<CropScan[]> {
    await new Promise((r) => setTimeout(r, 500));
    return mockScans;
  },

  async getScanById(id: string): Promise<CropScan | undefined> {
    await new Promise((r) => setTimeout(r, 300));
    return mockScans.find((s) => s.id === id);
  },

  async getScansByCropId(cropId: string): Promise<CropScan[]> {
    await new Promise((r) => setTimeout(r, 400));
    return mockScans.filter((s) => s.cropId === cropId);
  },

  // AI disease analysis pipeline is not connected yet
  async analyzeCropImage(_file: File): Promise<ScanResult | null> {
    return null;
  },
};
