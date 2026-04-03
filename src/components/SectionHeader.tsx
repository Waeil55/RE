import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  onSeeAll,
}) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See All →</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  title: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: colors.gray400,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  seeAll: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
});
