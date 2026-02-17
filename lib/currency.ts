// Función para formatear moneda en soles (PEN)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Función alternativa que usa S/. directamente
export function formatSoles(amount: number): string {
  return `S/. ${amount.toFixed(2)}`;
}

// Función para formatear sin símbolo (solo número)
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
