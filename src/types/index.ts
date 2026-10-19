export type TipoTransaccion = 'gasto' | 'ingreso';

export type Categoria =
  | 'Comida'
  | 'Transporte'
  | 'Hogar'
  | 'Ocio'
  | 'Salud'
  | 'Educación'
  | 'Otros'
  | 'Sueldo'
  | 'Propina/Regalo';

export type Transaccion = {
  id: string;
  tipo: TipoTransaccion;
  categoria: Categoria;
  monto: number;
  descripcion: string;
  fecha: string;
};

export type FiltroTransaccion = 'todos' | TipoTransaccion;
