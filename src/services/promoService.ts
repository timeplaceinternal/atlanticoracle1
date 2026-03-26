import { PromoCode } from '../types';

export const promoService = {
  async getPromoCodes(): Promise<PromoCode[]> {
    const response = await fetch('/api/promocodes');
    if (!response.ok) throw new Error('Failed to fetch promo codes');
    return response.json();
  },

  async savePromoCodes(codes: PromoCode[]): Promise<void> {
    console.log(">>> promoService.savePromoCodes - Sending codes:", codes);
    const response = await fetch('/api/promocodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codes),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(">>> promoService.savePromoCodes - Failed:", response.status, errorData);
      throw new Error(errorData.error || 'Failed to save promo codes');
    }
  },

  async deletePromoCode(id: string): Promise<void> {
    const response = await fetch(`/api/promocodes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete promo code');
  },

  async validatePromoCode(code: string): Promise<{ valid: boolean; discount?: number }> {
    const response = await fetch('/api/promocodes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error('Validation failed');
    return response.json();
  },

  async recordUsage(code: string, serviceId: string, amount: number): Promise<void> {
    const response = await fetch('/api/promocodes/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, serviceId, amount }),
    });
    if (!response.ok) throw new Error('Failed to record usage');
  }
};
