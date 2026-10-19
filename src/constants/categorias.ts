import type { Categoria, TipoTransaccion } from '@/types';

export const CATEGORIAS_GASTO: Categoria[] = [
  'Comida',
  'Transporte',
  'Hogar',
  'Ocio',
  'Salud',
  'Educación',
  'Otros',
];

export const CATEGORIAS_INGRESO: Categoria[] = ['Sueldo', 'Propina/Regalo', 'Otros'];

export const ICONOS_CATEGORIA: Record<Categoria, string> = {
  Comida: 'restaurant',
  Transporte: 'car',
  Hogar: 'home',
  Ocio: 'game-controller',
  Salud: 'medkit',
  Educación: 'school',
  Otros: 'ellipsis-horizontal',
  Sueldo: 'cash',
  'Propina/Regalo': 'gift',
};

export const CATEGORIAS_POR_TIPO: Record<TipoTransaccion, Categoria[]> = {
  gasto: CATEGORIAS_GASTO,
  ingreso: CATEGORIAS_INGRESO,
};
