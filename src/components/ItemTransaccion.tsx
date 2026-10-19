import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { ICONOS_CATEGORIA } from '@/constants/categorias';
import { theme } from '@/constants/theme';
import type { Transaccion } from '@/types';
import { formatearFecha, formatearMoneda } from '@/utils/formato';

type ItemTransaccionProps = {
  transaccion: Transaccion;
  onDelete: (id: string) => void;
  onEdit?: (transaccion: Transaccion) => void;
};

export default function ItemTransaccion({ transaccion, onDelete, onEdit }: ItemTransaccionProps) {
  const isIngreso = transaccion.tipo === 'ingreso';
  const color = isIngreso ? theme.success : theme.danger;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const confirmarEliminacion = () => {
    const mensaje = '¿Deseas eliminar esta transacción?';

    Alert.alert(
      'Eliminar movimiento',
      mensaje,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setShowConfirmDelete(false) },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setShowConfirmDelete(false);
            onDelete(transaccion.id);
          },
        },
      ],
    );
    setShowConfirmDelete(true);
  };

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onEdit?.(transaccion)}
        onLongPress={confirmarEliminacion}
        style={({ pressed }) => [styles.mainContent, pressed && styles.pressed]}>
        <View style={styles.infoRow}>
          <View style={[styles.iconWrap, { backgroundColor: color + '1A' }]}>
            <Ionicons
              name={(ICONOS_CATEGORIA[transaccion.categoria] ?? 'cash') as keyof typeof Ionicons.glyphMap}
              size={20}
              color={color}
            />
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.categoria}>{transaccion.categoria}</Text>
            <Text style={styles.descripcion} numberOfLines={1}>
              {transaccion.descripcion || 'Sin descripción'}
            </Text>
            <Text style={styles.fecha}>{formatearFecha(transaccion.fecha)}</Text>
          </View>
        </View>

        <View style={styles.montoWrap}>
          <Text style={[styles.monto, { color }]}>
            {isIngreso ? '+' : '-'} {formatearMoneda(transaccion.monto)}
          </Text>
        </View>
      </Pressable>

      {showConfirmDelete ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>¿Eliminar?</Text>
          <View style={styles.confirmActions}>
            <Pressable
              onPress={() => setShowConfirmDelete(false)}
              style={[styles.confirmButton, styles.cancelButton]}>
              <Text style={styles.cancelButtonText}>No</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowConfirmDelete(false);
                onDelete(transaccion.id);
              }}
              style={[styles.confirmButton, styles.confirmDeleteButton]}>
              <Text style={styles.confirmDeleteText}>Sí</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.actionsWrap}>
          {onEdit && (
            <Pressable
              onPress={() => onEdit(transaccion)}
              style={styles.actionButton}
              hitSlop={8}
              accessibilityRole="button">
              <Ionicons name="pencil-outline" size={16} color={theme.primary} />
            </Pressable>
          )}

          <Pressable
            onPress={() => setShowConfirmDelete(true)}
            style={[styles.actionButton, styles.deleteButton]}
            hitSlop={8}
            accessibilityRole="button">
            <Ionicons name="trash-outline" size={16} color={theme.danger} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 10,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  pressed: {
    opacity: 0.9,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
  categoria: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  descripcion: {
    marginTop: 2,
    color: theme.textMuted,
    fontSize: 12,
  },
  fecha: {
    marginTop: 4,
    color: theme.textMuted,
    fontSize: 11,
  },
  montoWrap: {
    marginLeft: 12,
  },
  monto: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionsWrap: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F3F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FFF1F2',
  },
  confirmBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 120,
  },
  confirmText: {
    color: theme.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 11,
    fontWeight: '700',
  },
  confirmDeleteButton: {
    backgroundColor: theme.danger,
  },
  confirmDeleteText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
