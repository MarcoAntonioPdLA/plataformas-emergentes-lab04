export const formatearMoneda = (valor: number): string =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(valor);

export const formatearFecha = (fecha: string): string => {
  const fechaLocal = new Date(`${fecha}T12:00:00`);

  return fechaLocal.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatearPorcentaje = (valor: number): string => `${valor.toFixed(0)}%`;
