import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BarraCategoria from '@/components/BarraCategoria';
import { theme } from '@/constants/theme';
import { useTransacciones } from '@/context/TransaccionesContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316'];

export default function ResumenScreen() {
  const { gastosPorCategoria, totalGastos } = useTransacciones();

  const categorias = useMemo(
    () =>
      Object.entries(gastosPorCategoria)
        .sort(([, a], [, b]) => b - a)
        .map(([categoria, valor], index) => ({
          categoria,
          valor,
          porcentaje: totalGastos > 0 ? (valor / totalGastos) * 100 : 0,
          color: COLORS[index % COLORS.length],
        })),
    [gastosPorCategoria, totalGastos],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gastos por categoría</Text>

        {categorias.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Todavía no hay gastos para resumir.</Text>
          </View>
        ) : (
          categorias.map((categoria) => (
            <BarraCategoria
              key={categoria.categoria}
              categoria={categoria.categoria}
              total={categoria.valor}
              porcentaje={categoria.porcentaje}
              color={categoria.color}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.textMuted,
    textAlign: 'center',
    fontSize: 14,
  },
});
