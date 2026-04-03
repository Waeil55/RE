import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'accent' | 'gold' | 'green' | 'red' | 'dark' | 'ai';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'accent',
  size = 'md',
  style,
}) => {
  const variantMap: Record<string, { bg: string; text: string; border?: string }> = {
    accent: { bg: 'rgba(56,189,248,0.15)', text: colors.accent, border: 'rgba(56,189,248,0.3)' },
    gold: { bg: 'rgba(245,158,11,0.15)', text: colors.accentGold, border: 'rgba(245,158,11,0.3)' },
    green: { bg: 'rgba(16,185,129,0.15)', text: colors.accentGreen, border: 'rgba(16,185,129,0.3)' },
    red: { bg: 'rgba(239,68,68,0.15)', text: colors.accentRed, border: 'rgba(239,68,68,0.3)' },
    dark: { bg: colors.glass, text: colors.gray300, border: colors.glassBorder },
    ai: { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA', border: 'rgba(139,92,246,0.3)' },
  };

  const v = variantMap[variant];

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' && styles.badgeSm,
        { backgroundColor: v.bg, borderColor: v.border || 'transparent' },
        style,
      ]}
    >
      <Text style={[styles.label, size === 'sm' && styles.labelSm, { color: v.text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelSm: {
    fontSize: 10,
  },
});
