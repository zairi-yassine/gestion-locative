import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Pressable, Alert, ScrollView, Switch, View, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createPayment, updatePayment, fetchProperties, fetchTenants } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function AddPaymentScreen() {
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);
  const shadow = Shadows[colorScheme];

  const [propertyId, setPropertyId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPropertyPicker, setShowPropertyPicker] = useState(false);
  const [showTenantPicker, setShowTenantPicker] = useState(false);

  useEffect(() => {
    loadData();
    if (isEditing) {
      setPropertyId(params.propertyId as string || '');
      setTenantId(params.tenantId as string || '');
      setAmount(params.amount as string || '');
      setMonth(params.month as string || '');
      setIsPaid(params.isPaid === 'true');
    } else {
      const now = new Date();
      const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      setMonth(defaultMonth);
    }
  }, [params]);

  const loadData = async () => {
    try {
      const [propertiesData, tenantsData] = await Promise.all([
        fetchProperties(),
        fetchTenants()
      ]);
      setProperties(propertiesData);
      setTenants(tenantsData);
      
      if (params.propertyId) {
        const prop = propertiesData.find((p: any) => p._id === params.propertyId);
        if (prop) setPropertyName(`${prop.title} - ${prop.rent}€`);
      }
      if (params.tenantId) {
        const tenant = tenantsData.find((t: any) => t._id === params.tenantId);
        if (tenant) setTenantName(tenant.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProperty = (property: any) => {
    setPropertyId(property._id);
    setPropertyName(`${property.title} - ${property.rent}€`);
    setAmount(property.rent.toString());
    setShowPropertyPicker(false);
  };

  const handleSelectTenant = (tenant: any) => {
    setTenantId(tenant._id);
    setTenantName(tenant.name);
    setShowTenantPicker(false);
  };

  const handleSubmit = async () => {
    if (!propertyId || !tenantId || !amount || !month) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Erreur', 'Le montant doit être un nombre positif');
      return;
    }

    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      Alert.alert('Erreur', 'Le format du mois doit être AAAA-MM (ex: 2024-05)');
      return;
    }

    setLoading(true);
    try {
      const data = {
        property: propertyId,
        tenant: tenantId,
        amount: amountValue,
        month,
        isPaid
      };

      if (isEditing) {
        await updatePayment(params.id as string, data);
        Alert.alert('Succès', 'Paiement modifié !', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        await createPayment(data);
        Alert.alert('Succès', 'Paiement enregistré !', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.headerSection}>
          <ThemedText style={[modernStyles.headerLarge, { color: colors.text }]}>
            {isEditing ? 'Modifier le paiement' : '💳 Nouveau paiement'}
          </ThemedText>
          <ThemedText style={[modernStyles.helperText, { color: colors.textSecondary }]}>
            {isEditing ? 'Modifiez les informations ci-dessous' : 'Enregistrez un nouveau paiement'}
          </ThemedText>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.backgroundCard }, shadow.md]}>
          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Propriété <ThemedText style={{ color: colors.error }}>*</ThemedText>
            </ThemedText>
            <Pressable 
              style={[
                styles.pickerButton,
                { 
                  backgroundColor: colors.backgroundAlt,
                  borderColor: colors.border,
                }
              ]} 
              onPress={() => setShowPropertyPicker(true)}
            >
              <ThemedText style={propertyName ? [styles.pickerText, { color: colors.text }] : [styles.pickerPlaceholder, { color: colors.textLight }]}>
                {propertyName || '-- Sélectionner une propriété --'}
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Locataire <ThemedText style={{ color: colors.error }}>*</ThemedText>
            </ThemedText>
            <Pressable 
              style={[
                styles.pickerButton,
                { 
                  backgroundColor: colors.backgroundAlt,
                  borderColor: colors.border,
                }
              ]} 
              onPress={() => setShowTenantPicker(true)}
            >
              <ThemedText style={tenantName ? [styles.pickerText, { color: colors.text }] : [styles.pickerPlaceholder, { color: colors.textLight }]}>
                {tenantName || '-- Sélectionner un locataire --'}
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Montant (€) <ThemedText style={{ color: colors.error }}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={[
                modernStyles.input,
                { 
                  backgroundColor: colors.backgroundAlt,
                  borderColor: colors.border,
                  color: colors.text,
                }
              ]}
              placeholder="Ex: 850"
              placeholderTextColor={colors.textLight}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Mois (AAAA-MM) <ThemedText style={{ color: colors.error }}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={[
                modernStyles.input,
                { 
                  backgroundColor: colors.backgroundAlt,
                  borderColor: colors.border,
                  color: colors.text,
                }
              ]}
              placeholder="Ex: 2024-05"
              placeholderTextColor={colors.textLight}
              value={month}
              onChangeText={setMonth}
            />
          </View>

          <View style={[styles.switchContainer, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
            <View>
              <ThemedText style={[styles.switchLabel, { color: colors.text }]}>Statut du paiement</ThemedText>
              <ThemedText style={[styles.switchSubtext, { color: colors.textSecondary }]}>
                {isPaid ? '✅ Payé' : '⏳ Non payé'}
              </ThemedText>
            </View>
            <Switch
              value={isPaid}
              onValueChange={setIsPaid}
              trackColor={{ false: colors.error, true: colors.success }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        {/* Property Picker Modal */}
        <Modal visible={showPropertyPicker} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
                  Sélectionner une propriété
                </ThemedText>
                <Pressable style={styles.closeButtonContainer} onPress={() => setShowPropertyPicker(false)}>
                  <ThemedText style={[styles.closeButton, { color: colors.textSecondary }]}>✕</ThemedText>
                </Pressable>
              </View>
              <FlatList
                data={properties}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                  <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Aucune propriété disponible
                  </ThemedText>
                }
                renderItem={({ item }) => (
                  <Pressable 
                    style={[
                      styles.pickerItem, 
                      { borderBottomColor: colors.border },
                      propertyId === item._id && { backgroundColor: colors.backgroundAlt }
                    ]} 
                    onPress={() => handleSelectProperty(item)}
                  >
                    <ThemedText style={[styles.pickerItemText, { color: colors.text }]}>{item.title}</ThemedText>
                    <ThemedText style={[styles.pickerItemSubtext, { color: colors.textSecondary }]}>{item.rent}€/mois</ThemedText>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Tenant Picker Modal */}
        <Modal visible={showTenantPicker} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
                  Sélectionner un locataire
                </ThemedText>
                <Pressable style={styles.closeButtonContainer} onPress={() => setShowTenantPicker(false)}>
                  <ThemedText style={[styles.closeButton, { color: colors.textSecondary }]}>✕</ThemedText>
                </Pressable>
              </View>
              <FlatList
                data={tenants}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                  <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Aucun locataire disponible
                  </ThemedText>
                }
                renderItem={({ item }) => (
                  <Pressable 
                    style={[
                      styles.pickerItem, 
                      { borderBottomColor: colors.border },
                      tenantId === item._id && { backgroundColor: colors.backgroundAlt }
                    ]} 
                    onPress={() => handleSelectTenant(item)}
                  >
                    <ThemedText style={[styles.pickerItemText, { color: colors.text }]}>{item.name}</ThemedText>
                    {item.email && <ThemedText style={[styles.pickerItemSubtext, { color: colors.textSecondary }]}>{item.email}</ThemedText>}
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Pressable
            style={[
              modernStyles.buttonPrimary,
              loading && modernStyles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <ThemedText style={modernStyles.buttonPrimaryText}>
              {loading ? 'Enregistrement...' : (isEditing ? '✓ Modifier' : '+ Ajouter')}
            </ThemedText>
          </Pressable>

          <Pressable style={modernStyles.buttonOutline} onPress={() => router.back()}>
            <ThemedText style={[modernStyles.buttonOutlineText, { color: colors.primary }]}>
              Annuler
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  headerSection: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  pickerButton: {
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  pickerText: {
    fontSize: 16,
  },
  pickerPlaceholder: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  switchSubtext: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '60%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButtonContainer: {
    padding: Spacing.sm,
  },
  closeButton: {
    fontSize: 20,
  },
  pickerItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderRadius: BorderRadius.md,
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pickerItemSubtext: {
    fontSize: 13,
    marginTop: Spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    padding: Spacing.xl,
  },
  actionsSection: {
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
});
