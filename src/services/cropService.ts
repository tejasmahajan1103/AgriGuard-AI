// ============================================================
// AgriGuard AI — Crop Service
// TODO: Replace with API Gateway + Lambda + DynamoDB calls
// ============================================================

import { mockCrops } from '../data/mockData';
import type { Crop, AddCropFormData } from '../types';
import { generateId } from '../utils/formatters';
import { GrowthStage, HealthStatus } from '../types';

let crops = [...mockCrops];

export const cropService = {
  async getCrops(): Promise<Crop[]> {
    await new Promise((r) => setTimeout(r, 500));
    return crops;
  },

  async getCropById(id: string): Promise<Crop | undefined> {
    await new Promise((r) => setTimeout(r, 300));
    return crops.find((c) => c.id === id);
  },

  async getCropsByFarmId(farmId: string): Promise<Crop[]> {
    await new Promise((r) => setTimeout(r, 400));
    return crops.filter((c) => c.farmId === farmId);
  },

  async addCrop(data: AddCropFormData): Promise<Crop> {
    await new Promise((r) => setTimeout(r, 800));
    const farm = (await import('../data/mockData')).mockFarms.find((f) => f.id === data.farmId);
    const newCrop: Crop = {
      id: `crop-${generateId()}`,
      name: data.name,
      farmId: data.farmId,
      farmName: farm?.name || 'Unknown Farm',
      plantingDate: data.plantingDate,
      growthStage: GrowthStage.Seedling,
      healthStatus: HealthStatus.Good,
      variety: data.variety,
      expectedHarvestDate: data.expectedHarvestDate,
    };
    crops = [...crops, newCrop];
    return newCrop;
  },

  async deleteCrop(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 500));
    crops = crops.filter((c) => c.id !== id);
  },
};
