import { useState } from 'react';
import { TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { register } from '@/services/api';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: '', color: colors.textLight };
    if (password.length < 6) return { strength: 'Trop court (min 6)', color: colors.error };
    if (password.length < 8) return { strength: 'Faible', color: colors.warning };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 'Moyen', color: colors.warning };
    return { strength: 'Fort', color: colors.success };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async () => {
    console.log('🔵 handleRegister called');
    console.log('📝 Form values:', { name, email, password: '***', confirmPassword: '***' });
    
    if (!email || !password) {
      Alert.alert('Erreur', 'Email et mot de passe sont obligatoires');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Sending register request...');
      const result = await register(email.toLowerCase().trim(), password, name.trim() || undefined);
      console.log('✅ Register success:', result);
      Alert.alert('Succès', 'Inscription réussie ! Vous pouvez maintenant vous connecter.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (error: any) {
      console.log('❌ Register error:', error);
      console.log('❌ Error message:', error.message);
      console.log('❌ Error response:', error.response);
      console.log('❌ Error response data:', error.response?.data);
      
      let message = 'Inscription échouée.\n\n';
      
      // Debug info
      message += `DEBUG: ${error.message || 'Unknown error'}\n`;
      if (error.code) message += `Code: ${error.code}\n`;
      if (error.response?.status) message += `Status: ${error.response.status}\n`;
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        message = error.response.data.errors.map((e: any) => e.msg).join('\n');
      } else if (error.code === 'ECONNABORTED') {
        message = 'Délai de connexion dépassé. Vérifiez votre connexion.';
      } else if (error.message === 'Network Error') {
        message = 'Network Error: Impossible de se connecter au serveur.\n\nVérifiez:\n1. Backend démarré\n2. Même réseau WiFi\n3. Firewall Windows';
      }
      
      Alert.alert('Erreur', message);
    } finally {
      console.log('🏁 Register finished, setting loading to false');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: colors.background }}
        >
          <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header Section */}
          <View style={styles.headerSection}>
            <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
              Inscription
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              Créez votre compte pour commencer
            </ThemedText>
          </View>
          
          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
                Nom (optionnel)
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
                placeholder="Votre nom"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
                Email <ThemedText style={{ color: colors.error }}>*</ThemedText>
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
                Mot de passe <ThemedText style={{ color: colors.error }}>*</ThemedText>
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
                placeholder="Minimum 6 caractères"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={[styles.strengthBar, { backgroundColor: passwordStrength.color, width: password.length < 6 ? '30%' : password.length < 8 ? '60%' : '100%' }]} />
                  <ThemedText style={[styles.strengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.strength}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
                Confirmer le mot de passe <ThemedText style={{ color: colors.error }}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  modernStyles.input,
                  { 
                    backgroundColor: colors.backgroundCard,
                    borderColor: confirmPassword.length > 0 && password !== confirmPassword ? colors.error : colors.border,
                    color: colors.text,
                  }
                ]}
                placeholder="Retapez votre mot de passe"
                placeholderTextColor={colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <ThemedText style={[modernStyles.errorText, { color: colors.error }]}>
                  Les mots de passe ne correspondent pas
                </ThemedText>
              )}
            </View>
            
            <Pressable 
              style={[
                modernStyles.buttonPrimary,
                loading && modernStyles.buttonDisabled,
                { marginTop: Spacing.lg }
              ]}
              onPress={() => {
                console.log('🟢 Button pressed!');
                handleRegister();
              }} 
              disabled={loading}
            >
              <ThemedText style={modernStyles.buttonPrimaryText}>
                {loading ? 'Inscription...' : "S'inscrire"}
              </ThemedText>
            </Pressable>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
              Vous avez déjà un compte ?
            </ThemedText>
            <Pressable onPress={() => router.back()}>
              <ThemedText style={[styles.linkText, { color: colors.primary }]}>
                Se connecter
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
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
    flex: 1,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  strengthContainer: {
    marginTop: -Spacing.md,
    marginBottom: Spacing.md,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
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