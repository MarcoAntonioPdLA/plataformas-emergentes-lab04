import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BotonFlotante from '@/components/BotonFlotante';
import FormularioTransaccion from '@/components/FormularioTransaccion';
import ItemTransaccion from '@/components/ItemTransaccion';
import TarjetaSaldo from '@/components/TarjetaSaldo';
import { theme } from '@/constants/theme';
import { useTransacciones } from '@/context/TransaccionesContext';
import type { Transaccion } from '@/types';

export default function InicioScreen() {
  const {
    transacciones,
    saldo,
    totalIngresos,
    totalGastos,
    agregarTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
  } = useTransacciones();
  const [modalVisible, setModalVisible] = useState(false);
  const [transaccionEnEdicion, setTransaccionEnEdicion] = useState<Transaccion | null>(null);
  const { width } = useWindowDimensions();
  const isWide = width > 700;

  const abrirModalNuevo = () => {
    setTransaccionEnEdicion(null);
    setModalVisible(true);
  };

  const abrirModalEdicion = (transaccion: Transaccion) => {
    setTransaccionEnEdicion(transaccion);
    setModalVisible(true);
  };

  // SafeAreaView evita cortes en iOS/Android; ScrollView permite desplazar el contenido principal.
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Money Tracker</Text>
            <Text style={styles.subtitle}>Controla tus finanzas</Text>
          </View>
          <Ionicons name="wallet" size={28} color={theme.primary} />
        </View>

        <View style={styles.balanceWrapper}>
          <Text style={styles.balanceLabel}>Saldo total</Text>
          <Text style={[styles.balanceValue, { color: saldo >= 0 ? theme.primary : theme.danger }]}>
            {new Intl.NumberFormat('es-PE', {
              style: 'currency',
              currency: 'PEN',
              minimumFractionDigits: 2,
            }).format(saldo)}
          </Text>
        </View>

        <View style={[styles.summaryRow, isWide && styles.summaryRowWide]}>
          <TarjetaSaldo titulo="Ingresos" valor={totalIngresos} tipo="ingreso" />
          <TarjetaSaldo titulo="Gastos" valor={totalGastos} tipo="gasto" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos movimientos</Text>
          <Pressable onPress={() => router.push('/(tabs)/movimientos')}>
            <Text style={styles.linkText}>Ver todas</Text>
          </Pressable>
        </View>

        {transacciones.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cash-outline" size={36} color={theme.textMuted} />
            <Text style={styles.emptyText}>Aún no tienes movimientos</Text>
          </View>
        ) : (
          transacciones.slice(0, 5).map((item) => (
            <ItemTransaccion
              key={item.id}
              transaccion={item}
              onDelete={eliminarTransaccion}
              onEdit={abrirModalEdicion}
            />
          ))
        )}
      </ScrollView>

      {/* Posicionamiento absoluto para dejar el botón flotante visible y accesible. */}
      <BotonFlotante onPress={abrirModalNuevo} />

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
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 90,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text,
  },
  subtitle: {
    color: theme.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  balanceWrapper: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  balanceLabel: {
    color: theme.textMuted,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  balanceValue: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryRowWide: {
    flexDirection: 'row',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '700',
  },
  linkText: {
    color: theme.primary,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: theme.card,
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    color: theme.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
