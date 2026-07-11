import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Page not found</Text>
        <Link href="/" style={styles.link}>
          Go to home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B1020',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4F7FA',
  },
  link: {
    marginTop: 16,
    fontSize: 16,
    color: '#79C7C3',
  },
});
