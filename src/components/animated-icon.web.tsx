import { StyleSheet, Text, View } from 'react-native';

export function AnimatedSplashOverlay() {
  return null;
}

export function AnimatedIcon() {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>M</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
});
