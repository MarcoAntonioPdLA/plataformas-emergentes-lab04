import { Stack } from 'expo-router';

import { TransaccionesProvider } from '@/context/TransaccionesContext';

export default function RootLayout() {
  return (
    <TransaccionesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </TransaccionesProvider>
  );
}
