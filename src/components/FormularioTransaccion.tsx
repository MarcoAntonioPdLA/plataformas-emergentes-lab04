import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { createElement, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CATEGORIAS_POR_TIPO } from '@/constants/categorias';
import { theme } from '@/constants/theme';
import type { Categoria, TipoTransaccion, Transaccion } from '@/types';
import { formatearFecha } from '@/utils/formato';

const obtenerFechaHoy = () => new Date();

const convertirFechaIsoLocal = (fecha: Date) => {
  const offset = fecha.getTimezoneOffset();
  const localDate = new Date(fecha.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 10);
};

type FormularioTransaccionProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (transaccion: Omit<Transaccion, 'id'>, id?: string) => void;
  transactionToEdit?: Transaccion | null;
};

export default function FormularioTransaccion({
  visible,
  onClose,
  onSubmit,
  transactionToEdit,
}: FormularioTransaccionProps) {
  const [tipo, setTipo] = useState<TipoTransaccion>('gasto');
  const [categoria, setCategoria] = useState<Categoria>('Comida');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaDate, setFechaDate] = useState(obtenerFechaHoy());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categoriasActivas = useMemo(() => CATEGORIAS_POR_TIPO[tipo], [tipo]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (transactionToEdit) {
      setTipo(transactionToEdit.tipo);
      setCategoria(transactionToEdit.categoria);
      setMonto(String(transactionToEdit.monto));
      setDescripcion(transactionToEdit.descripcion);
      const parsedDate = new Date(`${transactionToEdit.fecha}T12:00:00`);
      setFechaDate(Number.isNaN(parsedDate.getTime()) ? obtenerFechaHoy() : parsedDate);
      return;
    }

    setTipo('gasto');
    setCategoria(CATEGORIAS_POR_TIPO.gasto[0]);
    setMonto('');
    setDescripcion('');
    setFechaDate(obtenerFechaHoy());
  }, [visible, transactionToEdit]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (!categoriasActivas.includes(categoria)) {
      setCategoria(categoriasActivas[0]);
    }
  }, [categoria, categoriasActivas, visible]);

  const fecha = convertirFechaIsoLocal(fechaDate);

  const manejarEnvio = () => {
    if (!monto || Number(monto) <= 0) {
      return;
    }

    const payload: Omit<Transaccion, 'id'> = {
      tipo,
      categoria,
      monto: Number(monto),
      descripcion: descripcion.trim(),
      fecha,
    };

    onSubmit(payload, transactionToEdit?.id);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.overlay} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{transactionToEdit ? 'Editar transacción' : 'Nueva transacción'}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.toggleRow}>
              {(['gasto', 'ingreso'] as TipoTransaccion[]).map((opcion) => (
                <Pressable
                  key={opcion}
                  onPress={() => setTipo(opcion)}
                  style={[
                    styles.toggle,
                    tipo === opcion && [styles.toggleActive, { backgroundColor: opcion === 'gasto' ? theme.danger : theme.success }],
                  ]}>
                  <Text style={[styles.toggleText, tipo === opcion && styles.toggleTextActive]}>
                    {opcion === 'gasto' ? 'Gasto' : 'Ingreso'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              value={monto}
              onChangeText={setMonto}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={theme.textMuted}
            />

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.columnGrid}>
              {categoriasActivas.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setCategoria(item)}
                  style={[
                    styles.categoryChip,
                    categoria === item && { backgroundColor: tipo === 'gasto' ? theme.danger + '18' : theme.success + '18' },
                  ]}>
                  <Text
                    style={[
                      styles.categoryChipText,
                      categoria === item && { color: tipo === 'gasto' ? theme.danger : theme.success },
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Ej. Compra de mercado"
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Fecha</Text>

            {Platform.OS === 'web' ? (
              <View style={styles.webDateContainer}>
                {createElement('input', {
                  type: 'date',
                  value: fecha,
                  onChange: (event: { target: { value: string } }) => {
                    const nextValue = event.target.value;

                    if (!nextValue) {
                      setFechaDate(obtenerFechaHoy());
                      return;
                    }

                    const parsed = new Date(`${nextValue}T12:00:00`);

                    if (!Number.isNaN(parsed.getTime())) {
                      setFechaDate(parsed);
                    }
                  },
                  style: {
                    width: '100%',
                    boxSizing: 'border-box' as const,
                    backgroundColor: '#F7F8FB',
                    borderRadius: 14,
                    padding: '10px 14px',
                    fontSize: 15,
                    color: theme.text,
                    borderWidth: 1,
                    borderColor: '#EEF2F6',
                    marginBottom: 10,
                    maxWidth: '100%',
                  },
                })}
              </View>
            ) : (
              <>
                <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateText}>{formatearFecha(fecha)}</Text>
                  <Ionicons name="calendar-outline" size={18} color={theme.textMuted} />
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={fechaDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, selectedDate) => {
                      setShowDatePicker(false);

                      if (selectedDate) {
                        setFechaDate(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            )}
          </ScrollView>

          <Pressable style={styles.submitButton} onPress={manejarEnvio}>
            <Text style={styles.submitText}>{transactionToEdit ? 'Guardar cambios' : 'Guardar'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  sheet: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.text,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  toggle: {
    flex: 1,
    backgroundColor: '#F1F3F8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleActive: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textMuted,
  },
  toggleTextActive: {
    color: '#fff',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textMuted,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F7F8FB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.text,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  webDateContainer: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F8FB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 12,
  },
  dateText: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
  },
  columnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F4F6FA',
    borderWidth: 1,
    borderColor: '#E8ECF3',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.text,
  },
  submitButton: {
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: theme.primary,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
