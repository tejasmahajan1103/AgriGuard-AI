// ============================================================
// AgriGuard AI — Scan Service
// TODO: Replace with S3 upload + Lambda + Bedrock/Rekognition
// ============================================================

import { mockScans } from '../data/mockData';
import { getMockScanResult } from '../data/mockResponses';
import type { CropScan, ScanResult } from '../types';

export const scanService = {
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

  // TODO: Replace with S3 upload + Bedrock analysis
  async analyzeCropImage(_file: File): Promise<ScanResult> {
    return getMockScanResult();
  },
};
