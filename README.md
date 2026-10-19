# Money Tracker

Aplicación móvil para registrar ingresos y gastos personales con persistencia local, resumen financiero y navegación por tabs.

## Tecnologías utilizadas

La aplicación fue desarrollada con un stack orientado a React Native y Expo, con foco en una implementación simple, modular y funcional para un proyecto académico.

- Expo: framework base para la app móvil y su flujo de desarrollo.
- React Native: librería principal para construir la interfaz y el comportamiento de la aplicación.
- TypeScript: tipado estático para mayor seguridad en la lógica y componentes.
- Expo Router: navegación basada en rutas con tabs para Inicio, Movimientos y Resumen.
- @react-native-async-storage/async-storage: persistencia local para guardar transacciones.
- @expo/vector-icons: iconografía para representar categorías y acciones de la interfaz.
- Context API: administración del estado global de transacciones sin Redux ni librerías adicionales.
- Safe Area Context: manejo de márgenes seguros para iOS y Android.

## Instalación y ejecución

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia la app:
   ```bash
   npx expo start
   ```
3. Abre la aplicación en un emulador, simulador o Expo Go.

## Estructura del proyecto

- src/app/: rutas y layouts de Expo Router.
- src/app/(tabs)/: pantallas de Inicio, Movimientos y Resumen.
- src/components/: componentes reutilizables de la UI.
- src/context/TransaccionesContext.tsx: estado global y persistencia local.
- src/constants/: tema y categorías de gastos/ingresos.
- src/utils/formato.ts: formateo de moneda y fechas.
- src/types/: tipos del dominio de la aplicación.

## Componentes de Expo / React Native usados

- View: contenedores principales y layout en filas/columnas.
- Text: textos de títulos, subtítulos, saldo y categorías.
- Pressable: botones, filtros y acciones interactivas.
- TextInput: entrada del formulario para monto, descripción y fecha.
- SafeAreaView: respeta los márgenes del sistema en iOS y Android.
- ScrollView: pantallas con contenido principal desplazable.
- FlatList: listado de historial de movimientos.
- Modal: formulario emergente para registrar nuevas transacciones.
- KeyboardAvoidingView: evita que el teclado tape el formulario.
- StyleSheet.create: reúne todos los estilos del proyecto.
- Platform: adapta sombras y elevación según el sistema operativo.
- useWindowDimensions: adapta el layout según el ancho disponible.
- Alert: confirmación antes de borrar un movimiento.

## Funcionalidades implementadas

La aplicación incluye las siguientes funcionalidades:

- Registro de ingresos y gastos con monto, categoría, descripción y fecha.
- Soporte para tipos de movimiento con categorías específicas según el caso.
- Historial completo de transacciones ordenado por fecha más reciente.
- Edición de registros existentes desde la tarjeta o desde la vista principal.
- Eliminación de transacciones con confirmación visual dentro de la tarjeta.
- Cálculo automático de saldo, ingresos totales y gastos totales.
- Filtros para visualizar todos, solo gastos o solo ingresos.
- Resumen por categoría con barras de porcentaje para representar la participación de cada gasto.
- Selector de fecha nativo para facilitar la elección sin escribir manualmente.
- Botón flotante para abrir el formulario de registro desde cualquier pantalla principal.
- Persistencia local con AsyncStorage para conservar la información al cerrar la app.
- Interfaz responsiva con tarjetas, sombras, colores y layout adaptado para distintos tamaños de pantalla.
- Estados vacíos para cuando aún no existen movimientos.
- Validación básica antes de guardar una transacción con monto mayor a cero.

## Flujo principal de uso

1. Abre la app y observa el resumen de saldo, ingresos y gastos.
2. Usa el botón flotante para crear una nueva transacción.
3. Selecciona el tipo, asigna una categoría, ingresa el monto y selecciona la fecha.
4. Guarda el movimiento y observa la actualización del saldo y el historial.
5. Desde la tarjeta del registro puedes editar o eliminar el movimiento.
6. El resumen por categoría cambia conforme se agregan o actualizan los gastos.
