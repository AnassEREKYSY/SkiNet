/** Presentation helpers for order status badges (used by orders and admin). */

/** "PaymentReceived" -> "Payment received" */
export function orderStatusLabel(status?: string | null): string {
  if (!status) return '';
  const words = status.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function orderStatusClass(status?: string | null): string {
  switch (status) {
    case 'PaymentReceived':
      return 'bg-success/10 text-success';
    case 'Refunded':
    case 'PaymentFailed':
    case 'PaymentMismatch':
      return 'bg-danger/10 text-danger';
    default:
      return 'bg-ice-100 text-ice-700';
  }
}

export const orderBadgeBase =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold';
