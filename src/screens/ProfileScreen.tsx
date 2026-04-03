import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Badge } from '../components/Badge';

const MENU_ITEMS = [
  { icon: '🔔', label: 'Notifications', hasToggle: true },
  { icon: '📍', label: 'Location Preferences', hasArrow: true },
  { icon: '🔑', label: 'API Keys & Integrations', hasArrow: true },
  { icon: '🏠', label: 'My Listings', hasArrow: true },
  { icon: '📊', label: 'Market Reports', hasArrow: true },
  { icon: '🛡', label: 'Privacy & Security', hasArrow: true },
  { icon: '💬', label: 'Support', hasArrow: true },
  { icon: 'ℹ️', label: 'About', hasArrow: true },
];

export const ProfileScreen = () => {
  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          {/* User Card */}
          <View style={styles.section}>
            <GlassCard noPadding>
              <LinearGradient
                colors={['rgba(56,189,248,0.08)', 'rgba(15,23,42,0)']}
                style={styles.userCardGradient}
              >
                <View style={styles.userCard}>
                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarEmoji}>👤</Text>
                    <View style={styles.proIndicator} />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>Alex Johnson</Text>
                    <Text style={styles.userEmail}>alex.johnson@realty.com</Text>
                    <View style={styles.userBadges}>
                      <Badge label="Pro Agent" variant="gold" size="sm" style={{ marginRight: 6 }} />
                      <Badge label="AI Studio" variant="ai" size="sm" />
                    </View>
                  </View>
                  <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </GlassCard>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <GlassCard noPadding>
              <View style={styles.statsRow}>
                <StatItem value="42" label="Active Listings" />
                <View style={styles.statDivider} />
                <StatItem value="127" label="Photos Enhanced" />
                <View style={styles.statDivider} />
                <StatItem value="$18.4M" label="Total Sales" />
              </View>
            </GlassCard>
          </View>

          {/* AI Usage */}
          <View style={styles.section}>
            <GlassCard variant="accent">
              <View style={styles.aiUsageHeader}>
                <Text style={styles.aiUsageIcon}>✦</Text>
                <Text style={styles.aiUsageTitle}>AI Photo Studio</Text>
                <Badge label="Active" variant="green" size="sm" />
              </View>
              <View style={styles.aiUsageBar}>
                <View style={styles.aiUsageBarFill} />
              </View>
              <Text style={styles.aiUsageText}>127 / 200 photos this month</Text>
              <TouchableOpacity style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>Upgrade to Unlimited →</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* Menu */}
          <View style={styles.section}>
            <GlassCard noPadding>
              {MENU_ITEMS.map((item, i) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.hasToggle ? (
                      <Switch
                        value={true}
                        thumbColor={colors.white}
                        trackColor={{ false: colors.gray600, true: colors.accent }}
                      />
                    ) : (
                      <Text style={styles.menuArrow}>›</Text>
                    )}
                  </TouchableOpacity>
                  {i < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </GlassCard>
          </View>

          {/* Sign Out */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.signOutBtn}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    color: colors.white,
    fontSize: typography.fontSize['3xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: 12,
  },
  userCardGradient: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(56,189,248,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(56,189,248,0.35)',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  proIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accentGold,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
  },
  userEmail: {
    color: colors.gray400,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  userBadges: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  editBtnText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: 4,
  },
  statValue: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.gray400,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  aiUsageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiUsageIcon: {
    fontSize: 16,
    color: colors.accent,
  },
  aiUsageTitle: {
    flex: 1,
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.fontSize.base,
  },
  aiUsageBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  aiUsageBarFill: {
    width: '63.5%',
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  aiUsageText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    marginBottom: 10,
  },
  upgradeBtn: {},
  upgradeBtnText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: typography.fontSize.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: '500',
  },
  menuArrow: {
    color: colors.gray500,
    fontSize: 22,
    fontWeight: '300',
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginLeft: 58,
  },
  signOutBtn: {
    padding: 16,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.08)',
    alignItems: 'center',
  },
  signOutText: {
    color: colors.accentRed,
    fontWeight: '700',
    fontSize: typography.fontSize.base,
  },
});
