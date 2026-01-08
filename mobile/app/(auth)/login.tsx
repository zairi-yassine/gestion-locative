import { useState } from 'react';
import { TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { login } from '@/services/api';
import { saveToken } from '@/utils/auth';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);
  const shadow = Shadows[colorScheme];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email.toLowerCase().trim(), password);
      await saveToken(data.token);
      router.replace('/(tabs)/properties');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Connexion échouée. Vérifiez votre connexion internet.';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.iconText}>🏠</ThemedText>
            </View>
            <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
              Gestion Locative
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              Gérez vos propriétés avec facilité
            </ThemedText>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
                Email
              </ThemedText>
              <TextInput
                style={[
                  modernStyles.input,
                  { 
                    backgroundColor: colors.backgroundCard,
                    borderColor: colors.border,
                    color: colors.text,
                  }
                ]}
                placeholder="votre@email.com"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
                Mot de passe
              </ThemedText>
              <TextInput
                style={[
                  modernStyles.input,
                  { 
                    backgroundColor: colors.backgroundCard,
                    borderColor: colors.border,
                    color: colors.text,
                  }
                ]}
                placeholder="Votre mot de passe"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <Pressable 
              style={[
                modernStyles.buttonPrimary,
                loading && modernStyles.buttonDisabled,
                { marginTop: Spacing.lg }
              ]}
              onPress={handleLogin} 
              disabled={loading}
            >
              <ThemedText style={modernStyles.buttonPrimaryText}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
              Pas encore de compte ?
            </ThemedText>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <ThemedText style={[styles.linkText, { color: colors.primary }]}>
                S'inscrire maintenant
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  formSection: {
    marginVertical: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  footerSection: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  footerText: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  linkText: {
    fontWeight: '600',
    fontSize: 15,
  },
});