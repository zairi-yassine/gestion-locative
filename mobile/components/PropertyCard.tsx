import { View, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from './themed-text';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface PropertyCardProps {
  title: string;
  address: string;
  rent: number;
  tenantName?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function PropertyCard({
  title,
  address,
  rent,
  tenantName,
  onEdit,
  onDelete,
}: PropertyCardProps) {
  const colorScheme = useColorScheme()?? 'light';
  const colors = Colors[colorScheme];
  const shadow = Shadows[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundCard }, shadow.md]}>
      <View style={styles.header}>
        <View style={styles.content}>
          <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
          <ThemedText style={[styles.address, { color: colors.textSecondary }]}>
            📍 {address}
          </ThemedText>
        </View>
        <View style={[styles.rentBadge, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.rentText}>{rent}€</ThemedText>
        </View>
      </View>

      {tenantName && (
        <View style={[styles.tenantSection, { backgroundColor: colors.backgroundAlt }]}>
          <ThemedText style={[styles.tenantLabel, { color: colors.textSecondary }]}>
            👤 Locataire
          </ThemedText>
          <ThemedText style={[styles.tenantName, { color: colors.text }]}>
            {tenantName}
          </ThemedText>
        </View>
      )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  address: {
    fontSize: 14,
  },
  rentBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginLeft: Spacing.md,
  },
  rentText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  tenantSection: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  tenantLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  tenantName: {
    fontSize: 15,
    fontWeight: '600',
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