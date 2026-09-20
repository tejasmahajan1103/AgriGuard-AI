// ============================================================
// AgriGuard AI — S3 Upload Service Configuration
// AWS API Gateway + AgriGuardBackend Lambda Integration
// ============================================================

export const UPLOAD_API_URL =
  import.meta.env.VITE_UPLOAD_API_URL ||
  (import.meta.env.DEV
    ? '/upload-url'
    : 'https://a53cwd7442.execute-api.eu-north-1.amazonaws.com/upload-url');
