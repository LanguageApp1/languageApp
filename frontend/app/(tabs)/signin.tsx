//oauth

import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
        <h1>Sign In</h1>
        <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
            <IconSymbol
            size={310}
            color="#808080"
            name="person.fill"
            style={styles.headerImage}
            />
        }>
        <ThemedView style={styles.container}>
            <ThemedText type="title">Sign In</ThemedText>
            <ThemedText>Please sign in to continue</ThemedText>
        </ThemedView>
        </ParallaxScrollView>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  headerImage: {
    opacity: 0.5,
  }
});
