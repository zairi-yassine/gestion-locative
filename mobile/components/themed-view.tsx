import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  safe?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, safe = false, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  if (safe) {
    return <SafeAreaView style={[{ backgroundColor, flex: 1 }, style]} {...otherProps} />;
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
