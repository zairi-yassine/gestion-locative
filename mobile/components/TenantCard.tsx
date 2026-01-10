import { View, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from './themed-text';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface TenantCardProps {
  name: string;
  email?: string;
  phone?: string;
  propertyName?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function TenantCard({
  name,
  email,
  phone,
  propertyName,
  onEdit,
  onDelete,
}: TenantCardProps) {
  const colorScheme = useColorScheme()?? 'light';
  const colors = Colors[colorScheme];
  const shadow = Shadows[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundCard }, shadow.md]}>
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: colors.text }]}>{name}</ThemedText>
        {email && (
          <ThemedText style={[styles.subtext, { color: colors.textSecondary }]}>
            📧 {email}
          </ThemedText>
        )}
        {phone && (
          <ThemedText style={[styles.subtext, { color: colors.textSecondary }]}>
            📱 {phone}
          </ThemedText>
        )}
        {propertyName && (
          <View style={[styles.propertyBadge, { backgroundColor: colors.backgroundAlt }]}>
            <ThemedText style={[styles.propertyText, { color: colors.text }]}>
              🏠 {propertyName}
            </ThemedText>
          </View>
        )}
      </View>

      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <Pressable style={[styles.button, { backgroundColor: colors.primaryLight }]} onPress={onEdit}>
          <ThemedText style={styles.buttonText}>✏️ Modifier</ThemedText>
        </Pressable>
        <Pressable style={[styles.button, styles.deleteBtn, { backgroundColor: colors.error }]} onPress={onDelete}>
          <ThemedText style={styles.buttonText}>🗑️ Supprimer</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtext: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  propertyBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  propertyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  deleteBtn: {
    // Already styled with backgroundColor
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});