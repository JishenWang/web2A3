export class Formatters {
  static formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static formatPrice(price: number): string {
    if (price === null || price === undefined || price === 0) {
      return '<span style="color: #27ae60;">Free</span>';
    }
    return `$${price.toFixed(2)}`;
  }

  static calculateProgress(current: number, goal: number): number {
    if (!goal || goal === 0) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  }
}