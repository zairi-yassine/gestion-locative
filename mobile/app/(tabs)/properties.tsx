import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, Pressable, Alert, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchProperties, deleteProperty } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function PropertiesScreen() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);
  const shadow = Shadows[colorScheme];

  useFocusEffect(
    useCallback(() => {
      loadProperties();
    }, [])
  );

  const loadProperties = async () => {
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProperties();
  };

  const handleEdit = (item: any) => {
    router.push({
      pathname: '/(tabs)/add-property',
      params: {
        id: item._id,
        title: item.title,
        address: item.address,
        rent: item.rent.toString(),
      }
    });
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer "${item.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProperty(item._id);
              loadProperties();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la propriété');
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
            Mes Propriétés
          </ThemedText>
          <ThemedText style={[modernStyles.helperText, { color: colors.textSecondary }]}>
            {properties.length} propriété{properties.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>
        <Pressable 
          style={[modernStyles.buttonPrimary, { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md }]} 
          onPress={() => router.push('/(tabs)/add-property')}
        >
          <ThemedText style={modernStyles.buttonPrimaryText}>+ Ajouter</ThemedText>
        </Pressable>
      </View>
      
      {properties.length === 0 ? (
        <View style={modernStyles.emptyState}>
          <ThemedText style={[modernStyles.emptyStateText, { color: colors.text }]}>
            📋 Aucune propriété
          </ThemedText>
          <ThemedText style={[modernStyles.emptyStateSubtext, { color: colors.textSecondary }]}>
            Commencez par ajouter votre première propriété
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item: any) => item._id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          scrollEnabled={true}
          renderItem={({ item }: any) => (
            <View style={[modernStyles.card, { backgroundColor: colors.backgroundCard }, shadow.md]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardContent}>
                  <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={[styles.cardAddress, { color: colors.textSecondary }]}>
                    📍 {item.address}
                  </ThemedText>
                </View>
                <View style={[styles.rentBadge, { backgroundColor: colors.primary }]}>
                  <ThemedText style={styles.rentText}>{item.rent}€</ThemedText>
                </View>
              </View>

              {item.tenant && (
                <View style={[styles.tenantSection, { borderTopColor: colors.border, backgroundColor: colors.backgroundAlt }]}>
                  <ThemedText style={[styles.tenantLabel, { color: colors.textSecondary }]}>
                    👤 Locataire
                  </ThemedText>
                  <ThemedText style={[styles.tenantName, { color: colors.text }]}>
                    {item.tenant.name}
                  </ThemedText>
                </View>
              )}

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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  cardAddress: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  rentBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  rentText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  tenantSection: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    marginHorizontal: -Spacing.lg,
    marginBottom: Spacing.md,
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