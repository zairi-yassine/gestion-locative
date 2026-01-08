import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Pressable, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createProperty, updateProperty } from '@/services/api';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { createModernStyles } from '@/constants/styles';

export default function AddPropertyScreen() {
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const modernStyles = createModernStyles(colorScheme);
  const shadow = Shadows[colorScheme];

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setTitle(params.title as string || '');
      setAddress(params.address as string || '');
      setRent(params.rent as string || '');
    }
  }, [params]);

  const handleSubmit = async () => {
    if (!title || !address || !rent) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const rentValue = parseFloat(rent);
    if (isNaN(rentValue) || rentValue <= 0) {
      Alert.alert('Erreur', 'Le loyer doit être un nombre positif');
      return;
    }

    setLoading(true);
    try {
      const data = { title, address, rent: rentValue };
      if (isEditing) {
        await updateProperty(params.id as string, data);
        Alert.alert('Succès', 'Propriété modifiée !', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        await createProperty(data);
        Alert.alert('Succès', 'Propriété ajoutée !', [
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
            {isEditing ? 'Modifier la propriété' : '🏠 Nouvelle propriété'}
          </ThemedText>
          <ThemedText style={[modernStyles.helperText, { color: colors.textSecondary }]}>
            {isEditing ? 'Modifiez les informations ci-dessous' : 'Remplissez les informations de votre propriété'}
          </ThemedText>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.backgroundCard }, shadow.md]}>
          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Titre <ThemedText style={{ color: colors.error }}>*</ThemedText>
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
              placeholder="Ex: Appartement T2 centre ville"
              placeholderTextColor={colors.textLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Adresse <ThemedText style={{ color: colors.error }}>*</ThemedText>
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
              placeholder="Ex: 123 Rue de la Paix, Paris"
              placeholderTextColor={colors.textLight}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[modernStyles.labelText, { color: colors.text }]}>
              Loyer mensuel (€) <ThemedText style={{ color: colors.error }}>*</ThemedText>
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
              value={rent}
              onChangeText={setRent}
              keyboardType="numeric"
            />
          </View>
        </View>

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
  actionsSection: {
    gap: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
});
