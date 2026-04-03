import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Linking,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { Badge } from '../components/Badge';
import { GlassCard } from '../components/GlassCard';
import { mockProperties } from '../data/mockData';

const { width, height } = Dimensions.get('window');

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  return `$${price.toLocaleString()}`;
};

const FEATURE_ICONS: Record<string, string> = {
  pool: '🏊',
  garage: '🚗',
  garden: '🌿',
  fireplace: '🔥',
  gym: '💪',
  theater: '🎬',
  wine: '🍷',
  smart: '🏠',
  solar: '☀️',
  beach: '🏖',
  view: '🏔',
};

const getFeatureIcon = (feature: string) => {
  const lower = feature.toLowerCase();
  for (const key of Object.keys(FEATURE_ICONS)) {
    if (lower.includes(key)) return FEATURE_ICONS[key];
  }
  return '✓';
};

export const PropertyDetailScreen = ({ route, navigation }: any) => {
  const { propertyId } = route.params;
  const property = mockProperties.find((p) => p.id === propertyId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  if (!property) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Property not found</Text>
      </View>
    );
  }

  const statusLabel: Record<string, string> = {
    'for-sale': 'For Sale',
    'for-rent': 'For Rent',
    sold: 'Sold',
    pending: 'Pending',
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <FlatList
          data={property.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => `img-${i}`}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
          )}
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(15,23,42,0.6)', 'transparent', 'transparent', 'rgba(15,23,42,0.9)']}
          locations={[0, 0.2, 0.6, 1]}
          style={styles.imageGradient}
        />

        {/* Top Controls */}
        <SafeAreaView style={styles.topControls}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.topRight}>
            <TouchableOpacity
              onPress={() => setSaved(!saved)}
              style={styles.iconBtn}
            >
              <Text style={{ fontSize: 20 }}>{saved ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={{ fontSize: 18 }}>📤</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Image indicators */}
        <View style={styles.indicators}>
          {property.images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                i === activeImageIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        {/* AI Badge on image */}
        {property.isAIEnhanced && (
          <View style={styles.aiImageBadge}>
            <Text style={styles.aiImageBadgeText}>✦ AI Enhanced Photos</Text>
          </View>
        )}

        {/* Image counter */}
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {activeImageIndex + 1}/{property.images.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Price & Status */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{formatPrice(property.price)}</Text>
            {property.pricePerSqft && (
              <Text style={styles.pricePerSqft}>
                ${property.pricePerSqft.toLocaleString()} / ft²
              </Text>
            )}
          </View>
          <Badge
            label={statusLabel[property.status]}
            variant={property.status === 'for-sale' ? 'green' : property.status === 'pending' ? 'gold' : 'dark'}
          />
        </View>

        {/* Title & Address */}
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <Text style={styles.address}>
          📍 {property.address}, {property.city}, {property.state}
        </Text>

        {/* Tags */}
        {property.tags && property.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {property.tags.map((tag) => (
              <Badge key={tag} label={tag} variant="accent" size="sm" style={{ marginRight: 6 }} />
            ))}
          </View>
        )}

        {/* Stats Grid */}
        <GlassCard style={styles.statsCard} noPadding>
          <View style={styles.statsGrid}>
            <StatBox icon="🛏" label="Bedrooms" value={`${property.bedrooms}`} />
            <View style={styles.gridDivider} />
            <StatBox icon="🚿" label="Bathrooms" value={`${property.bathrooms}`} />
            <View style={styles.gridDivider} />
            <StatBox icon="📐" label="Sq Footage" value={`${property.sqft.toLocaleString()}`} />
            <View style={styles.gridDivider} />
            <StatBox icon="🏗" label="Year Built" value={`${property.yearBuilt}`} />
            {property.garage !== undefined && (
              <>
                <View style={styles.gridDividerFull} />
                <StatBox icon="🚗" label="Garage" value={`${property.garage} cars`} />
                {property.lotSize && (
                  <>
                    <View style={styles.gridDivider} />
                    <StatBox
                      icon="🌿"
                      label="Lot Size"
                      value={`${property.lotSize.toLocaleString()} ft²`}
                    />
                  </>
                )}
              </>
            )}
          </View>
        </GlassCard>

        {/* Description */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>About This Property</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Features & Amenities</Text>
          <View style={styles.featuresGrid}>
            {property.features.map((feature) => (
              <View key={feature} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{getFeatureIcon(feature)}</Text>
                <Text style={styles.featureLabel}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Enhancement Notice */}
        {property.isAIEnhanced && (
          <GlassCard variant="accent" style={styles.aiNotice}>
            <View style={styles.aiNoticeHeader}>
              <Text style={styles.aiNoticeIcon}>✦</Text>
              <Text style={styles.aiNoticeTitle}>AI Enhanced Photos</Text>
            </View>
            <Text style={styles.aiNoticeText}>
              These photos have been processed with our AI enhancement system.
              Lighting corrected, personal items removed, and quality upscaled to
              professional UHD standard. All structural elements and surfaces remain
              100% true to the original property.
            </Text>
            <TouchableOpacity
              style={styles.enhanceMoreBtn}
              onPress={() =>
                navigation.navigate('Enhance', { propertyId: property.id })
              }
            >
              <Text style={styles.enhanceMoreText}>Enhance More Photos →</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* Agent Card */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Listed By</Text>
          <GlassCard noPadding>
            <View style={styles.agentCard}>
              <View style={styles.agentAvatarWrap}>
                <Text style={styles.agentAvatarEmoji}>👤</Text>
              </View>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{property.agent.name}</Text>
                <Text style={styles.agentAgency}>{property.agent.agency}</Text>
                <View style={styles.agentRating}>
                  <Text style={styles.ratingStars}>★★★★★</Text>
                  <Text style={styles.ratingValue}>{property.agent.rating}</Text>
                  <Text style={styles.ratingCount}>({property.agent.reviews})</Text>
                </View>
              </View>
              <View style={styles.agentActions}>
                <TouchableOpacity
                  style={styles.agentBtn}
                  onPress={() => Linking.openURL(`tel:${property.agent.phone}`)}
                >
                  <Text style={styles.agentBtnText}>📞</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.agentBtn}
                  onPress={() => Linking.openURL(`mailto:${property.agent.email}`)}
                >
                  <Text style={styles.agentBtnText}>✉️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.agentStats}>
              <View style={styles.agentStat}>
                <Text style={styles.agentStatValue}>{property.agent.sales}</Text>
                <Text style={styles.agentStatLabel}>Total Sales</Text>
              </View>
              <View style={styles.agentStatDivider} />
              <View style={styles.agentStat}>
                <Text style={styles.agentStatValue}>{property.agent.reviews}</Text>
                <Text style={styles.agentStatLabel}>Reviews</Text>
              </View>
              <View style={styles.agentStatDivider} />
              <View style={styles.agentStat}>
                <Text style={styles.agentStatValue}>5+ yrs</Text>
                <Text style={styles.agentStatLabel}>Experience</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <LinearGradient
          colors={['transparent', colors.primary]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.ctaRow}>
          <View>
            <Text style={styles.ctaPrice}>{formatPrice(property.price)}</Text>
            <Text style={styles.ctaLabel}>
              {property.status === 'for-rent' ? '/month' : 'Purchase Price'}
            </Text>
          </View>
          <TouchableOpacity style={styles.ctaBtn}>
            <LinearGradient
              colors={colors.gradientAccent as [string, string]}
              style={styles.ctaBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaBtnText}>Schedule Tour</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const StatBox: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statBoxIcon}>{icon}</Text>
    <Text style={styles.statBoxValue}>{value}</Text>
    <Text style={styles.statBoxLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  notFound: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
  },
  imageContainer: {
    height: height * 0.42,
    position: 'relative',
  },
  image: {
    width,
    height: height * 0.42,
  },
  imageGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
  },
  backBtn: {
    backgroundColor: 'rgba(15,23,42,0.7)',
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.fontSize.sm,
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(15,23,42,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  indicatorActive: {
    width: 20,
    backgroundColor: colors.white,
  },
  aiImageBadge: {
    position: 'absolute',
    bottom: 44,
    right: 16,
    backgroundColor: 'rgba(139,92,246,0.85)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  aiImageBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  imageCounter: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: 'rgba(15,23,42,0.7)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageCounterText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingTop: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  price: {
    color: colors.white,
    fontSize: typography.fontSize['3xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pricePerSqft: {
    color: colors.gray400,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  propertyTitle: {
    color: colors.white,
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: -0.3,
  },
  address: {
    color: colors.gray300,
    fontSize: typography.fontSize.base,
    marginTop: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  statsCard: {
    marginTop: 20,
    padding: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 0,
  },
  gridDivider: {
    width: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: 4,
  },
  gridDividerFull: {
    width: '100%',
    height: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    minWidth: 80,
  },
  statBoxIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  statBoxValue: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
  },
  statBoxLabel: {
    color: colors.gray400,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionBlock: {
    marginTop: 24,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: colors.gray300,
    fontSize: typography.fontSize.base,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 6,
  },
  featureIcon: {
    fontSize: 16,
  },
  featureLabel: {
    color: colors.gray200,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  aiNotice: {
    marginTop: 20,
  },
  aiNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiNoticeIcon: {
    fontSize: 18,
    color: colors.accent,
  },
  aiNoticeTitle: {
    color: colors.accent,
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
  },
  aiNoticeText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  enhanceMoreBtn: {
    marginTop: 12,
  },
  enhanceMoreText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: typography.fontSize.sm,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  agentAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(56,189,248,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(56,189,248,0.3)',
  },
  agentAvatarEmoji: {
    fontSize: 28,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
  },
  agentAgency: {
    color: colors.gray400,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  agentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingStars: {
    color: colors.accentGold,
    fontSize: 12,
  },
  ratingValue: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  ratingCount: {
    color: colors.gray400,
    fontSize: 12,
  },
  agentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  agentBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentBtnText: {
    fontSize: 18,
  },
  agentStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    padding: 12,
  },
  agentStat: {
    flex: 1,
    alignItems: 'center',
  },
  agentStatValue: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
  },
  agentStatLabel: {
    color: colors.gray400,
    fontSize: 11,
    marginTop: 2,
  },
  agentStatDivider: {
    width: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: 4,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34,
    paddingTop: 20,
    paddingHorizontal: spacing.base,
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaPrice: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
  },
  ctaLabel: {
    color: colors.gray400,
    fontSize: 11,
    marginTop: 2,
  },
  ctaBtn: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.accent,
  },
  ctaBtnGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  ctaBtnText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
