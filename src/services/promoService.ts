import { PromoCode } from '../types';

export const promoService = {
  async getPromoCodes(): Promise<PromoCode[]> {
    const response = await fetch('/api/promocodes');
    if (!response.ok) throw new Error('Failed to fetch promo codes');
    return response.json();
  },

  async savePromoCode(promo: PromoCode): Promise<void> {
    const response = await fetch('/api/promocodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promo),
    });
    if (!response.ok) throw new Error('Failed to save promo code');
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
  }
};
