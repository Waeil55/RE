import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'dark' | 'light' | 'accent';
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'dark',
  noPadding = false,
}) => {
  const variantStyles: Record<string, ViewStyle> = {
    dark: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.glassBorder,
    },
    light: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(255,255,255,0.5)',
    },
    accent: {
      backgroundColor: 'rgba(56,189,248,0.1)',
      borderColor: 'rgba(56,189,248,0.25)',
    },
  };

  return (
    <View
      style={[
        styles.card,
        variantStyles[variant],
        !noPadding && styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    ...shadows.md,
    overflow: 'hidden',
  },
  padding: {
    padding: 16,
  },
});
