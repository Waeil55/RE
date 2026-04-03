import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { PropertyCard } from '../components/PropertyCard';
import { SearchBar } from '../components/SearchBar';
import { SectionHeader } from '../components/SectionHeader';
import { Badge } from '../components/Badge';
import { mockProperties } from '../data/mockData';

const { width } = Dimensions.get('window');

const MARKET_STATS = [
  { label: 'Avg. Price', value: '$2.4M', change: '+4.2%', up: true },
  { label: 'Days on Market', value: '18', change: '-3 days', up: false },
  { label: 'Active Listings', value: '1,247', change: '+12%', up: true },
];

const FILTER_TABS = ['All', 'Houses', 'Condos', 'For Rent', 'New'];

export const HomeScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const featured = mockProperties.filter((p) => p.isAIEnhanced || p.status === 'for-sale');
  const nearby = mockProperties.slice(2);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Floating header on scroll */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={[colors.primary, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={colors.gradientHero as [string, string, string]}
          style={styles.hero}
        >
          <SafeAreaView>
            <View style={styles.heroInner}>
              {/* Top bar */}
              <View style={styles.topBar}>
                <View>
                  <Text style={styles.greeting}>Good morning, 👋</Text>
                  <Text style={styles.heroTitle}>Find Your{'\n'}Dream Home</Text>
                </View>
                <TouchableOpacity style={styles.notifBtn}>
                  <Text style={styles.notifIcon}>🔔</Text>
                  <View style={styles.notifDot} />
                </TouchableOpacity>
              </View>

              {/* Search */}
              <View style={{ marginTop: 20 }}>
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  onFilterPress={() => navigation.navigate('Listings')}
                />
              </View>

              {/* Filter tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 14 }}
                contentContainerStyle={{ paddingRight: 4 }}
              >
                {FILTER_TABS.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveFilter(tab)}
                    style={[
                      styles.filterTab,
                      activeFilter === tab && styles.filterTabActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        activeFilter === tab && styles.filterTabTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Market Stats Strip */}
        <View style={styles.statsStrip}>
          <LinearGradient
            colors={['rgba(56,189,248,0.08)', 'rgba(56,189,248,0.03)']}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.statsRow}>
              {MARKET_STATS.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <Text
                      style={[
                        styles.statChange,
                        { color: stat.up ? colors.accentGreen : colors.accentRed },
                      ]}
                    >
                      {stat.up ? '↑' : '↓'} {stat.change}
                    </Text>
                  </View>
                  {i < MARKET_STATS.length - 1 && (
                    <View style={styles.statDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* AI Enhancement Banner */}
        <View style={styles.section}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Enhance')}
          >
            <LinearGradient
              colors={['#1a0a3a', '#0d1f4a', '#0a2a2a']}
              style={styles.aiBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.aiBannerContent}>
                <View style={styles.aiIconCircle}>
                  <Text style={styles.aiIconText}>✦</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aiBannerTitle}>AI Photo Enhancement</Text>
                  <Text style={styles.aiBannerSub}>
                    Transform any photo into a professional UHD listing image
                  </Text>
                </View>
                <View style={styles.aiBannerArrow}>
                  <Text style={styles.aiBannerArrowText}>→</Text>
                </View>
              </View>
              <View style={styles.aiBannerFeatures}>
                <FeaturePill label="Auto Declutter" />
                <FeaturePill label="HDR Lighting" />
                <FeaturePill label="4K Upscale" />
                <FeaturePill label="AI Staging" />
              </View>
              {/* Decorative glow */}
              <View style={styles.aiBannerGlow} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Featured Listings */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={{ paddingHorizontal: spacing.base }}>
            <SectionHeader
              title="Featured Listings"
              subtitle={`${featured.length} premium properties`}
              onSeeAll={() => navigation.navigate('Listings')}
            />
          </View>
          <FlatList
            data={featured}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: spacing.base, paddingRight: 8 }}
            renderItem={({ item }) => (
              <PropertyCard
                property={item}
                variant="featured"
                onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.id })}
              />
            )}
            snapToInterval={width - 24}
            decelerationRate="fast"
            pagingEnabled={false}
          />
        </View>

        {/* Nearby Properties */}
        <View style={styles.section}>
          <SectionHeader
            title="Nearby You"
            subtitle="Based on your location"
            onSeeAll={() => navigation.navigate('Listings')}
          />
          {nearby.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="list"
              onPress={() =>
                navigation.navigate('PropertyDetail', { propertyId: property.id })
              }
            />
          ))}
        </View>

        {/* Agent Highlight */}
        <View style={styles.section}>
          <SectionHeader title="Top Agents" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(3)].map((_, i) => {
              const agents = [
                { name: 'Sarah Mitchell', agency: 'LuxRealty', sales: 148, avatar: '👩' },
                { name: 'James Chen', agency: 'Premier Props', sales: 203, avatar: '👨' },
                { name: 'Elena Vasquez', agency: 'Elite Homes', sales: 74, avatar: '👩‍💼' },
              ];
              const agent = agents[i];
              return (
                <View key={i} style={styles.agentCard}>
                  <View style={styles.agentAvatar}>
                    <Text style={{ fontSize: 32 }}>{agent.avatar}</Text>
                  </View>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <Text style={styles.agentAgency}>{agent.agency}</Text>
                  <Badge label={`${agent.sales} Sales`} variant="gold" size="sm" style={{ marginTop: 6, alignSelf: 'center' }} />
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
};

const FeaturePill: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.featurePill}>
    <Text style={styles.featurePillText}>✓ {label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 100,
  },
  hero: {
    paddingBottom: 24,
  },
  heroInner: {
    paddingHorizontal: spacing.base,
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  heroTitle: {
    color: colors.white,
    fontSize: typography.fontSize['4xl'],
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 42,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginTop: 20,
  },
  notifIcon: {
    fontSize: 18,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentRed,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterTabText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: colors.primary,
  },
  statsStrip: {
    marginHorizontal: spacing.base,
    marginTop: -8,
    marginBottom: 4,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
  },
  statsGradient: {
    padding: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  },
  statChange: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: 4,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginTop: 24,
  },
  aiBanner: {
    borderRadius: radius['2xl'],
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: 'rgba(139,92,246,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiIconText: {
    fontSize: 20,
    color: '#A78BFA',
  },
  aiBannerTitle: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
  },
  aiBannerSub: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  aiBannerArrow: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBannerArrowText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  aiBannerFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  featurePill: {
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
  },
  featurePillText: {
    color: '#C4B5FD',
    fontSize: 11,
    fontWeight: '600',
  },
  aiBannerGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139,92,246,0.15)',
  },
  agentCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: 16,
    alignItems: 'center',
    width: 140,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.sm,
  },
  agentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(56,189,248,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(56,189,248,0.3)',
  },
  agentName: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  agentAgency: {
    color: colors.gray400,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});
