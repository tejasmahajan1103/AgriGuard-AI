// ============================================================
// AgriGuard AI — Alert Service
// TODO: Replace with API Gateway + Lambda + DynamoDB
// ============================================================

import { mockAlerts } from '../data/mockData';
import type { Alert } from '../types';

let alerts = [...mockAlerts];

export const alertService = {
  async getAlerts(): Promise<Alert[]> {
    await new Promise((r) => setTimeout(r, 500));
    return alerts;
  },

  async markAsRead(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    alerts = alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a));
  },

  async markAllAsRead(): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    alerts = alerts.map((a) => ({ ...a, isRead: true }));
  },

  getUnreadCount(): number {
    return alerts.filter((a) => !a.isRead).length;
  },
};
