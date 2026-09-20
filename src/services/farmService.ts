// ============================================================
// AgriGuard AI — Farm Service
// TODO: Replace with API Gateway + Lambda + DynamoDB calls
// ============================================================

import { mockFarms } from '../data/mockData';
import type { Farm, AddFarmFormData } from '../types';
import { generateId } from '../utils/formatters';
import { HealthStatus } from '../types';

let farms = [...mockFarms];

export const farmService = {
  async getFarms(): Promise<Farm[]> {
    await new Promise((r) => setTimeout(r, 500));
    return farms;
  },

  async getFarmById(id: string): Promise<Farm | undefined> {
    await new Promise((r) => setTimeout(r, 300));
    return farms.find((f) => f.id === id);
  },

  async addFarm(data: AddFarmFormData): Promise<Farm> {
    await new Promise((r) => setTimeout(r, 800));
    const newFarm: Farm = {
      id: `farm-${generateId()}`,
      name: data.name,
      location: data.location,
      area: data.area,
      areaUnit: data.areaUnit,
      cropCount: 0,
      healthStatus: HealthStatus.Good,
      crops: [],
      createdAt: new Date().toISOString(),
    };
    farms = [...farms, newFarm];
    return newFarm;
  },

  async deleteFarm(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 500));
    farms = farms.filter((f) => f.id !== id);
  },
};
