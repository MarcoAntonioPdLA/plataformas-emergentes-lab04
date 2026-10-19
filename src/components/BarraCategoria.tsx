import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { formatearMoneda, formatearPorcentaje } from '@/utils/formato';

type BarraCategoriaProps = {
  categoria: string;
  total: number;
  porcentaje: number;
  color: string;
};

export default function BarraCategoria({ categoria, total, porcentaje, color }: BarraCategoriaProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.nombre}>{categoria}</Text>
        <Text style={styles.valor}>
          {formatearMoneda(total)} · {formatearPorcentaje(porcentaje)}
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(porcentaje, 4)}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  nombre: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  valor: {
    color: theme.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    height: 10,
    backgroundColor: '#E7EBF2',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
