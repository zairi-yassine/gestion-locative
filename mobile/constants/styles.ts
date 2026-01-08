/**
 * Global modern styles for the app
 * Reusable style templates for buttons, cards, inputs, etc.
 */

import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows, FontSizes } from './theme';

export const createModernStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  const shadow = Shadows[colorScheme];

  return StyleSheet.create({
    // Buttons
    buttonPrimary: {
      backgroundColor: colors.primary,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.md,
    },
    buttonPrimaryText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: FontSizes.base,
    },
    buttonSecondary: {
      backgroundColor: colors.backgroundAlt,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSecondaryText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: FontSizes.base,
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonOutlineText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: FontSizes.base,
    },
    buttonSmall: {
      backgroundColor: colors.primary,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSmallText: {
      color: '#FFFFFF',
      fontWeight: '500',
      fontSize: FontSizes.sm,
    },
    buttonDisabled: {
      opacity: 0.5,
    },

    // Cards
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      ...shadow.md,
    },
    cardSmall: {
      backgroundColor: colors.backgroundCard,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      ...shadow.sm,
    },
    cardBorder: {
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Inputs
    input: {
      backgroundColor: colors.backgroundCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      fontSize: FontSizes.base,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    inputFocused: {
      borderColor: colors.primary,
      backgroundColor: colors.backgroundAlt,
    },
    inputError: {
      borderColor: colors.error,
    },

    // Text
    textInput: {
      color: colors.text,
    },
    textInputPlaceholder: {
      color: colors.textLight,
    },
    labelText: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    helperText: {
      fontSize: FontSizes.xs,
      color: colors.textLight,
      marginTop: Spacing.xs,
    },
    errorText: {
      fontSize: FontSizes.sm,
      color: colors.error,
      marginTop: Spacing.sm,
    },

    // Headers
    headerLarge: {
      fontSize: FontSizes['3xl'],
      fontWeight: '800',
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    headerMedium: {
      fontSize: FontSizes['2xl'],
      fontWeight: '700',
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    headerSmall: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: colors.text,
      marginBottom: Spacing.xs,
    },

    // Sections
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
      paddingHorizontal: Spacing.lg,
    },
    sectionTitle: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
      color: colors.text,
    },

    // List containers
    listContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.lg,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
    },
    emptyStateText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: colors.text,
      marginBottom: Spacing.md,
      textAlign: 'center',
    },
    emptyStateSubtext: {
      fontSize: FontSizes.base,
      color: colors.textSecondary,
      textAlign: 'center',
    },

    // Chip/Badge
    chipPrimary: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    chipPrimaryText: {
      color: '#FFFFFF',
      fontWeight: '500',
      fontSize: FontSizes.sm,
    },
    chipSecondary: {
      backgroundColor: colors.backgroundAlt,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipSecondaryText: {
      color: colors.text,
      fontWeight: '500',
      fontSize: FontSizes.sm,
    },

    // Status
    statusBadgeSuccess: {
      backgroundColor: colors.success,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
    },
    statusBadgeWarning: {
      backgroundColor: colors.warning,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
    },
    statusBadgeError: {
      backgroundColor: colors.error,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
    },

    // Divider
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: Spacing.lg,
    },
    dividerLight: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginVertical: Spacing.md,
    },
  });
};
