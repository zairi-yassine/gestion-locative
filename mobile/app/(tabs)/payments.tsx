import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, Pressable, Alert, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchPayments, deletePayment, updatePayment } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);
  const shadow = Shadows[colorScheme];

  useFocusEffect(
    useCallback(() => {
      loadPayments();
    }, [])
  );

  const loadPayments = async () => {
    try {
      const data = await fetchPayments();
      setPayments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  const handleTogglePaid = async (item: any) => {
    try {
      await updatePayment(item._id, { isPaid: !item.isPaid });
      loadPayments();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut');
    }
  };

  const handleEdit = (item: any) => {
    router.push({
      pathname: '/(tabs)/add-payment',
      params: {
        id: item._id,
        propertyId: item.property?._id || '',
        tenantId: item.tenant?._id || '',
        amount: item.amount.toString(),
        month: item.month,
        isPaid: item.isPaid.toString(),
      }
    });
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer ce paiement ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePayment(item._id);
              loadPayments();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le paiement');
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
            Paiements
          </ThemedText>
          <ThemedText style={[modernStyles.helperText, { color: colors.textSecondary }]}>
            {payments.length} paiement{payments.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>
        <Pressable 
          style={[modernStyles.buttonPrimary, { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md }]} 
          onPress={() => router.push('/(tabs)/add-payment')}
        >
          <ThemedText style={modernStyles.buttonPrimaryText}>+ Ajouter</ThemedText>
        </Pressable>
      </View>

      {payments.length === 0 ? (
        <View style={modernStyles.emptyState}>
          <ThemedText style={[modernStyles.emptyStateText, { color: colors.text }]}>
            💳 Aucun paiement
          </ThemedText>
          <ThemedText style={[modernStyles.emptyStateSubtext, { color: colors.textSecondary }]}>
            Enregistrez votre premier paiement
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item: any) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          scrollEnabled={true}
          renderItem={({ item }: any) => (
            <View style={[
              modernStyles.card, 
              { backgroundColor: colors.backgroundCard }, 
              shadow.md,
              item.isPaid && styles.cardPaid,
              !item.isPaid && styles.cardUnpaid
            ]}>
              <View style={styles.cardContent}>
                <View style={styles.amountHeader}>
                  <ThemedText style={[styles.amountText, { color: colors.text }]}>
                    {item.amount}€
                  </ThemedText>
                  <Pressable 
                    style={[
                      styles.statusBadge, 
                      item.isPaid ? [styles.paidBadge, { backgroundColor: colors.success }] : [styles.unpaidBadge, { backgroundColor: colors.error }]
                    ]}
                    onPress={() => handleTogglePaid(item)}
                  >
                    <ThemedText style={styles.statusText}>
                      {item.isPaid ? '✅ Payé' : '⏳ Impayé'}
                    </ThemedText>
                  </Pressable>
                </View>
                <ThemedText style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                  📅 {item.month}
                </ThemedText>
                {item.property && (
                  <ThemedText style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                    🏠 {item.property.title}
                  </ThemedText>
                )}
                {item.tenant && (
                  <ThemedText style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                    👤 {item.tenant.name}
                  </ThemedText>
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
  cardPaid: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardUnpaid: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  cardContent: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  amountText: {
    fontSize: 22,
    fontWeight: '700',
  },
  cardSubtext: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  paidBadge: {
    backgroundColor: '#10B981',
  },
  unpaidBadge: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
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