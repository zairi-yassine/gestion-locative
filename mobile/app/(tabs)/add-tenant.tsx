import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Pressable, Alert, ScrollView, View, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createTenant, updateTenant, fetchProperties } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function AddTenantScreen() {
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);
  const shadow = Shadows[colorScheme];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadProperties();
    if (isEditing) {
      setName(params.name as string || '');
      setEmail(params.email as string || '');
      setPhone(params.phone as string || '');
      setPropertyId(params.propertyId as string || '');
    }
  }, [params]);

  const loadProperties = async () => {
    try {
      const data = await fetchProperties();
      setProperties(data);
      if (params.propertyId) {
        const prop = data.find((p: any) => p._id === params.propertyId);
        if (prop) setPropertyName(`${prop.title} - ${prop.address}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProperty = (property: any) => {
    setPropertyId(property._id);
    setPropertyName(`${property.title} - ${property.address}`);
    setShowPicker(false);
  };

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return;
    }

    setLoading(true);
    try {
      const data: any = { name, email, phone };
      if (propertyId) {
        data.property = propertyId;
      }

      if (isEditing) {
        await updateTenant(params.id as string, data);
        Alert.alert('Succès', 'Locataire modifié !', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        await createTenant(data);
        Alert.alert('Succès', 'Locataire ajouté !', [
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
            {isEditing ? 'Modifier le locataire' : '👤 Nouveau locataire'}
          </ThemedText>
          <ThemedText style={[modernStyles.helperText, { color: colors.textSecondary }]}>
            {isEditing ? 'Modifiez les informations ci-dessous' : 'Remplissez les informations du locataire'}
          </ThemedText>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.backgroundCard }, shadow.md]}>
          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Nom <ThemedText style={{ color: colors.error }}>*</ThemedText>
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
              placeholder="Ex: Jean Dupont"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Email
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
              placeholder="Ex: jean.dupont@email.com"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Téléphone
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
              placeholder="Ex: 06 12 34 56 78"
              placeholderTextColor={colors.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Propriété assignée
            </ThemedText>
            <Pressable 
              style={[
                styles.pickerButton,
                { 
                  backgroundColor: colors.backgroundAlt,
                  borderColor: colors.border,
                }
              ]} 
              onPress={() => setShowPicker(true)}
            >
              <ThemedText style={propertyName ? [styles.pickerText, { color: colors.text }] : [styles.pickerPlaceholder, { color: colors.textLight }]}>
                {propertyName || '-- Sélectionner une propriété --'}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Property Picker Modal */}
        <Modal visible={showPicker} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
                  Sélectionner une propriété
                </ThemedText>
                <Pressable style={styles.closeButtonContainer} onPress={() => setShowPicker(false)}>
                  <ThemedText style={[styles.closeButton, { color: colors.textSecondary }]}>✕</ThemedText>
                </Pressable>
              </View>
              <Pressable 
                style={[styles.pickerItem, { borderBottomColor: colors.border }]} 
                onPress={() => { setPropertyId(''); setPropertyName(''); setShowPicker(false); }}
              >
                <ThemedText style={[styles.pickerItemText, { color: colors.textSecondary }]}>-- Aucune --</ThemedText>
              </Pressable>
              <FlatList
                data={properties}
                keyExtractor={(item) => item._id}
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
                    <ThemedText style={[styles.pickerItemSubtext, { color: colors.textSecondary }]}>{item.address}</ThemedText>
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
  actionsSection: {
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
});
