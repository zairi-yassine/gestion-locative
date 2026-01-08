import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, Pressable, Alert, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchTenants, deleteTenant } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function TenantsScreen() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);
  const shadow = Shadows[colorScheme];

  useFocusEffect(
    useCallback(() => {
      loadTenants();
    }, [])
  );

  const loadTenants = async () => {
    try {
      const data = await fetchTenants();
      setTenants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTenants();
  };

  const handleEdit = (item: any) => {
    router.push({
      pathname: '/(tabs)/add-tenant',
      params: {
        id: item._id,
        name: item.name,
        email: item.email || '',
        phone: item.phone || '',
        propertyId: item.property?._id || '',
      }
    });
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer "${item.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTenant(item._id);
              loadTenants();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le locataire');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView safe style={[modernStyles.listContainer, { backgroundColor: colors.background }]}>
        <ThemedText>Chargement...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView safe style={[modernStyles.listContainer, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <ThemedText style={[modernStyles.headerLarge, { color: colors.text }]}>
            Mes Locataires
          </ThemedText>
          <ThemedText style={[modernStyles.helperText, { color: colors.textSecondary }]}>
            {tenants.length} locataire{tenants.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>
        <Pressable 
          style={[modernStyles.buttonPrimary, { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md }]} 
          onPress={() => router.push('/(tabs)/add-tenant')}
        >
          <ThemedText style={modernStyles.buttonPrimaryText}>+ Ajouter</ThemedText>
        </Pressable>
      </View>

      {tenants.length === 0 ? (
        <View style={modernStyles.emptyState}>
          <ThemedText style={[modernStyles.emptyStateText, { color: colors.text }]}>
            👤 Aucun locataire
          </ThemedText>
          <ThemedText style={[modernStyles.emptyStateSubtext, { color: colors.textSecondary }]}>
            Commencez par ajouter votre premier locataire
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={tenants}
          keyExtractor={(item: any) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          scrollEnabled={true}
          renderItem={({ item }: any) => (
            <View style={[modernStyles.card, { backgroundColor: colors.backgroundCard }, shadow.md]}>
              <View style={styles.cardContent}>
                <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                  {item.name}
                </ThemedText>
                {item.email && (
                  <ThemedText style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                    📧 {item.email}
                  </ThemedText>
                )}
                {item.phone && (
                  <ThemedText style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                    📱 {item.phone}
                  </ThemedText>
                )}
                {item.property && (
                  <View style={[styles.propertyBadge, { backgroundColor: colors.backgroundAlt }]}>
                    <ThemedText style={[styles.propertyText, { color: colors.text }]}>
                      🏠 {item.property.title}
                    </ThemedText>
                  </View>
                )}
              </View>
              <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
                <Pressable 
                  style={[modernStyles.buttonSecondary, { flex: 1 }]} 
                  onPress={() => handleEdit(item)}
                >
                  <ThemedText style={[modernStyles.buttonSecondaryText, { fontSize: 14 }]}>
                    ✏️ Modifier
                  </ThemedText>
                </Pressable>
                <View style={{ width: Spacing.md }} />
                <Pressable 
                  style={[styles.deleteButton, { flex: 1, backgroundColor: colors.error }]} 
                  onPress={() => handleDelete(item)}
                >
                  <ThemedText style={styles.deleteButtonText}>🗑️ Supprimer</ThemedText>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  cardContent: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  cardSubtext: {
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
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  deleteButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});