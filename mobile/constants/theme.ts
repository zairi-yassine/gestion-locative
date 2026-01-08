/**
 * Modern theme with contemporary colors and design tokens.
 * Supports light and dark mode with gradient colors for a modern aesthetic.
 */

import { Platform } from 'react-native';

// Primary colors - vibrant blue gradient
const primaryLight = '#6366F1';
const primaryDark = '#7C8AFF';
const accentLight = '#EC4899';
const accentDark = '#F472B6';

// Status colors
const successLight = '#10B981';
const warningLight = '#F59E0B';
const errorLight = '#EF4444';

export const Colors = {
  light: {
    // Text colors
    text: '#1F2937',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    
    // Backgrounds
    background: '#F9FAFB',
    backgroundCard: '#FFFFFF',
    backgroundAlt: '#F3F4F6',
    
    // Primary
    primary: primaryLight,
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    // Accent
    accent: accentLight,
    accentLight: '#F472B6',
    
    // Status
    success: successLight,
    warning: warningLight,
    error: errorLight,
    
    // Legacy support
    tint: primaryLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryLight,
    
    // Borders
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  },
  dark: {
    // Text colors
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textLight: '#9CA3AF',
    
    // Backgrounds
    background: '#111827',
    backgroundCard: '#1F2937',
    backgroundAlt: '#374151',
    
    // Primary
    primary: primaryDark,
    primaryLight: '#A5B4FC',
    primaryDark: '#818CF8',
    
    // Accent
    accent: accentDark,
    accentLight: '#F472B6',
    
    // Status
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    
    // Legacy support
    tint: primaryDark,
    icon: '#D1D5DB',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryDark,
    
    // Borders
    border: '#374151',
    borderLight: '#4B5563',
  },
};

// Font sizes
export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

// Border radius
export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const Shadows = {
  light: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    xl: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  },
  dark: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 2 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    xl: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
