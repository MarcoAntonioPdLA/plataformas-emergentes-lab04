import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { formatearMoneda } from '@/utils/formato';

type TarjetaSaldoProps = {
  titulo: string;
  valor: number;
  tipo?: 'saldo' | 'ingreso' | 'gasto';
};

export default function TarjetaSaldo({ titulo, valor, tipo = 'saldo' }: TarjetaSaldoProps) {
  const color =
    tipo === 'ingreso'
      ? theme.success
      : tipo === 'gasto'
        ? theme.danger
        : theme.primary;

  return (
    <View style={[styles.card, { borderColor: color + '30' }]}>
      <Text style={styles.label}>{titulo}</Text>
      <Text style={[styles.valor, { color }]}>{formatearMoneda(valor)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  label: {
    color: theme.textMuted,
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  valor: {
    fontSize: 22,
    fontWeight: '700',
  },
});
