import { Stack } from 'expo-router';

export default function MemoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B1020' },
      }}
    />
  );
}
