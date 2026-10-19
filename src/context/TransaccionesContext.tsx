import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { FiltroTransaccion, Transaccion, TipoTransaccion } from '@/types';

const STORAGE_KEY = '@moneytracker:transacciones';

type TransaccionesContextValue = {
  transacciones: Transaccion[];
  saldo: number;
  totalIngresos: number;
  totalGastos: number;
  gastosPorCategoria: Record<string, number>;
  agregarTransaccion: (nuevaTransaccion: Omit<Transaccion, 'id'>) => void;
  actualizarTransaccion: (id: string, transaccionActualizada: Omit<Transaccion, 'id'>) => void;
  eliminarTransaccion: (id: string) => void;
  transaccionesFiltradas: (filtro: FiltroTransaccion) => Transaccion[];
};

const TransaccionesContext = createContext<TransaccionesContextValue | undefined>(undefined);

const ordenarPorFecha = (a: Transaccion, b: Transaccion) =>
  new Date(b.fecha).getTime() - new Date(a.fecha).getTime();

export function TransaccionesProvider({ children }: { children: React.ReactNode }) {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cargarTransacciones = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (raw) {
          const parsed: Transaccion[] = JSON.parse(raw);
          setTransacciones(parsed.sort(ordenarPorFecha));
        }
      } catch (error) {
        console.warn('No se pudieron cargar las transacciones', error);
      } finally {
        setIsLoaded(true);
      }
    };

    cargarTransacciones();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transacciones)).catch((error) => {
      console.warn('No se pudieron guardar las transacciones', error);
    });
  }, [isLoaded, transacciones]);

  const agregarTransaccion = (nuevaTransaccion: Omit<Transaccion, 'id'>) => {
    const transaccion: Transaccion = {
      ...nuevaTransaccion,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setTransacciones((prev) => [transaccion, ...prev].sort(ordenarPorFecha));
  };

  const actualizarTransaccion = (id: string, transaccionActualizada: Omit<Transaccion, 'id'>) => {
    setTransacciones((prev) =>
      prev
        .map((transaccion) =>
          transaccion.id === id ? { ...transaccion, ...transaccionActualizada } : transaccion,
        )
        .sort(ordenarPorFecha),
    );
  };

  const eliminarTransaccion = (id: string) => {
    setTransacciones((prev) => prev.filter((transaccion) => transaccion.id !== id));
  };

  const totalIngresos = useMemo(
    () =>
      transacciones
        .filter((transaccion) => transaccion.tipo === 'ingreso')
        .reduce((sum, transaccion) => sum + transaccion.monto, 0),
    [transacciones],
  );

  const totalGastos = useMemo(
    () =>
      transacciones
        .filter((transaccion) => transaccion.tipo === 'gasto')
        .reduce((sum, transaccion) => sum + transaccion.monto, 0),
    [transacciones],
  );

  const saldo = totalIngresos - totalGastos;

  const gastosPorCategoria = useMemo(() => {
    const categorias: Record<string, number> = {};

    transacciones
      .filter((item) => item.tipo === 'gasto')
      .forEach((item) => {
        categorias[item.categoria] = (categorias[item.categoria] ?? 0) + item.monto;
      });

    return categorias;
  }, [transacciones]);

  const transaccionesFiltradas = (filtro: FiltroTransaccion) => {
    if (filtro === 'todos') {
      return [...transacciones].sort(ordenarPorFecha);
    }

    return [...transacciones]
      .filter((transaccion) => transaccion.tipo === filtro)
      .sort(ordenarPorFecha);
  };

  const value = useMemo<TransaccionesContextValue>(
    () => ({
      transacciones,
      saldo,
      totalIngresos,
      totalGastos,
      gastosPorCategoria,
      agregarTransaccion,
      actualizarTransaccion,
      eliminarTransaccion,
      transaccionesFiltradas,
    }),
    [gastosPorCategoria, saldo, totalGastos, totalIngresos, transacciones],
  );

  return <TransaccionesContext.Provider value={value}>{children}</TransaccionesContext.Provider>;
}

export function useTransacciones() {
  const context = useContext(TransaccionesContext);

  if (!context) {
    throw new Error('useTransacciones debe usarse dentro de TransaccionesProvider');
  }

  return context;
}
