import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormularioTransaccion from '@/components/FormularioTransaccion';
import ItemTransaccion from '@/components/ItemTransaccion';
import { theme } from '@/constants/theme';
import { useTransacciones } from '@/context/TransaccionesContext';
import type { FiltroTransaccion, Transaccion } from '@/types';

const filtros: Array<{ label: string; value: FiltroTransaccion }> = [
  { label: 'Todos', value: 'todos' },
  { label: 'Gastos', value: 'gasto' },
  { label: 'Ingresos', value: 'ingreso' },
];

export default function MovimientosScreen() {
  const { transaccionesFiltradas, agregarTransaccion, actualizarTransaccion, eliminarTransaccion } =
    useTransacciones();
  const [filtroActual, setFiltroActual] = useState<FiltroTransaccion>('todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [transaccionEnEdicion, setTransaccionEnEdicion] = useState<Transaccion | null>(null);

  const datos = useMemo(() => transaccionesFiltradas(filtroActual), [filtroActual, transaccionesFiltradas]);

  const abrirModalEdicion = (transaccion: Transaccion) => {
    setTransaccionEnEdicion(transaccion);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Historial</Text>

        <View style={styles.filterRow}>
          {filtros.map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.filterButton,
                filtroActual === item.value && styles.filterButtonActive,
              ]}
              onPress={() => setFiltroActual(item.value)}>
              <Text
                style={[
                  styles.filterText,
                  filtroActual === item.value && styles.filterTextActive,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {datos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={34} color={theme.textMuted} />
            <Text style={styles.emptyText}>No hay movimientos para este filtro</Text>
          </View>
        ) : (
          <FlatList
            data={datos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ItemTransaccion
                transaccion={item}
                onDelete={eliminarTransaccion}
                onEdit={abrirModalEdicion}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <FormularioTransaccion
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setTransaccionEnEdicion(null);
        }}
        transactionToEdit={transaccionEnEdicion}
        onSubmit={(nuevaTransaccion, id) => {
          if (id) {
            actualizarTransaccion(id, nuevaTransaccion);
          } else {
            agregarTransaccion(nuevaTransaccion);
          }

          setModalVisible(false);
          setTransaccionEnEdicion(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5EAF1',
  },
  filterButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterText: {
    color: theme.text,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 28,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 20,
    gap: 10,
  },
  emptyText: {
    color: theme.textMuted,
    textAlign: 'center',
    fontSize: 14,
  },
});
