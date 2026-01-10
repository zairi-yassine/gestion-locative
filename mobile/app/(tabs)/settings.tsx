import { StyleSheet, Pressable, Alert, View } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { removeToken } from '@/utils/auth';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function SettingsScreen() {
  const colorScheme = useColorScheme()?? 'light';
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);
  const shadow = Shadows[colorScheme];

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await removeToken();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <ThemedView safe style={[modernStyles.listContainer, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.headerSection}>
        <ThemedText style={[modernStyles.headerLarge, { color: colors.text }]}>
          ⚙️ Paramètres
        </ThemedText>
        <ThemedText style={[modernStyles.helperText, { color: colors.textSecondary }]}>
          Gérez votre compte et préférences
        </ThemedText>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          COMPTE
        </ThemedText>
        
        <View style={[modernStyles.card, { backgroundColor: colors.backgroundCard }, shadow.md]}>
          <View style={styles.menuItem}>
            <ThemedText style={[styles.menuIcon, { color: colors.text }]}>👤</ThemedText>
            <View style={styles.menuContent}>
              <ThemedText style={[styles.menuText, { color: colors.text }]}>Profil</ThemedText>
              <ThemedText style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Gérer vos informations
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <ThemedText style={[styles.menuIcon, { color: colors.error }]}>🚪</ThemedText>
            <View style={styles.menuContent}>
              <ThemedText style={[styles.menuText, { color: colors.error }]}>Se déconnecter</ThemedText>
              <ThemedText style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Quitter votre compte
              </ThemedText>
            </View>
          </Pressable>
        </View>
      </View>

      {/* App Section */}
      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          APPLICATION
        </ThemedText>
        
        <View style={[modernStyles.card, { backgroundColor: colors.backgroundCard }, shadow.md]}>
          <View style={styles.menuItem}>
            <ThemedText style={[styles.menuIcon, { color: colors.text }]}>🔔</ThemedText>
            <View style={styles.menuContent}>
              <ThemedText style={[styles.menuText, { color: colors.text }]}>Notifications</ThemedText>
              <ThemedText style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Gérer les alertes
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.menuItem}>
            <ThemedText style={[styles.menuIcon, { color: colors.text }]}>🌙</ThemedText>
            <View style={styles.menuContent}>
              <ThemedText style={[styles.menuText, { color: colors.text }]}>Thème</ThemedText>
              <ThemedText style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                {colorScheme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé'}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          À PROPOS
        </ThemedText>
        
        <View style={[modernStyles.card, { backgroundColor: colors.backgroundCard }, shadow.md]}>
          <View style={styles.aboutContent}>
            <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.appIconText}>🏠</ThemedText>
            </View>
            <ThemedText style={[styles.appName, { color: colors.text }]}>
              Gestion Locative
            </ThemedText>
            <ThemedText style={[styles.versionText, { color: colors.textSecondary }]}>
              Version 1.0.0
            </ThemedText>
            <ThemedText style={[styles.copyrightText, { color: colors.textLight }]}>
              © 2025 - Tous droits réservés
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginLeft: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 32,
    textAlign: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  aboutContent: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appIconText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  versionText: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  copyrightText: {
    fontSize: 12,
  },
});
