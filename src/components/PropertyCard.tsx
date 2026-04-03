import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { Property } from '../types';
import { Badge } from './Badge';

const { width } = Dimensions.get('window');

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  variant?: 'featured' | 'compact' | 'list';
}

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
  return `$${price}`;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  variant = 'compact',
}) => {
  const [saved, setSaved] = useState(false);

  const statusColor: Record<string, string> = {
    'for-sale': colors.accentGreen,
    'for-rent': colors.accent,
    sold: colors.gray400,
    pending: colors.accentGold,
  };

  const statusLabel: Record<string, string> = {
    'for-sale': 'For Sale',
    'for-rent': 'For Rent',
    sold: 'Sold',
    pending: 'Pending',
  };

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        style={[styles.featured, shadows.lg]}
      >
        <Image
          source={{ uri: property.images[0] }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(10,18,38,0.7)', 'rgba(10,18,38,0.97)']}
          style={styles.featuredGradient}
          locations={[0.2, 0.6, 1]}
        />

        {/* Top row */}
        <View style={styles.featuredTop}>
          <Badge
            label={statusLabel[property.status]}
            variant={property.status === 'for-sale' ? 'green' : property.status === 'pending' ? 'gold' : 'dark'}
            size="sm"
          />
          {property.isAIEnhanced && (
            <Badge label="AI Enhanced" variant="ai" size="sm" style={{ marginLeft: 6 }} />
          )}
          <TouchableOpacity
            onPress={() => setSaved(!saved)}
            style={styles.heartBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ fontSize: 20 }}>{saved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom */}
        <View style={styles.featuredBottom}>
          <View style={styles.tags}>
            {property.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} label={tag} variant="dark" size="sm" style={{ marginRight: 6 }} />
            ))}
          </View>
          <Text style={styles.featuredPrice}>{formatPrice(property.price)}</Text>
          <Text style={styles.featuredTitle} numberOfLines={1}>{property.title}</Text>
          <Text style={styles.featuredAddress} numberOfLines={1}>
            {property.address}, {property.city}, {property.state}
          </Text>
          <View style={styles.statsRow}>
            <StatPill icon="🛏" value={`${property.bedrooms} bd`} />
            <StatPill icon="🚿" value={`${property.bathrooms} ba`} />
            <StatPill icon="📐" value={`${property.sqft.toLocaleString()} ft²`} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'list') {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.listCard, shadows.sm]}
      >
        <Image
          source={{ uri: property.images[0] }}
          style={styles.listImage}
          resizeMode="cover"
        />
        {property.isAIEnhanced && (
          <View style={styles.listAIBadge}>
            <Text style={styles.listAIText}>✦ AI</Text>
          </View>
        )}
        <View style={styles.listContent}>
          <View style={styles.listTop}>
            <Text style={styles.listPrice}>{formatPrice(property.price)}</Text>
            <View
              style={[styles.statusDot, { backgroundColor: statusColor[property.status] }]}
            />
          </View>
          <Text style={styles.listTitle} numberOfLines={1}>{property.title}</Text>
          <Text style={styles.listAddress} numberOfLines={1}>
            {property.city}, {property.state}
          </Text>
          <View style={styles.listStats}>
            <Text style={styles.statText}>{property.bedrooms}bd</Text>
            <View style={styles.dot} />
            <Text style={styles.statText}>{property.bathrooms}ba</Text>
            <View style={styles.dot} />
            <Text style={styles.statText}>{property.sqft.toLocaleString()} ft²</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setSaved(!saved)}
          style={styles.listHeart}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 18 }}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // Compact default
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.compact, shadows.md]}
    >
      <Image
        source={{ uri: property.images[0] }}
        style={styles.compactImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(10,18,38,0.9)']}
        style={styles.compactGradient}
      />
      <View style={styles.compactTop}>
        {property.isAIEnhanced && (
          <Badge label="AI Enhanced" variant="ai" size="sm" />
        )}
        <TouchableOpacity
          onPress={() => setSaved(!saved)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 18 }}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.compactBottom}>
        <Text style={styles.compactPrice}>{formatPrice(property.price)}</Text>
        <Text style={styles.compactTitle} numberOfLines={1}>{property.title}</Text>
        <Text style={styles.compactCity} numberOfLines={1}>{property.city}, {property.state}</Text>
        <View style={styles.compactStats}>
          <Text style={styles.compactStat}>{property.bedrooms}bd</Text>
          <Text style={styles.compactStat}>·</Text>
          <Text style={styles.compactStat}>{property.bathrooms}ba</Text>
          <Text style={styles.compactStat}>·</Text>
          <Text style={styles.compactStat}>{(property.sqft / 1000).toFixed(1)}k ft²</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StatPill: React.FC<{ icon: string; value: string }> = ({ icon, value }) => (
  <View style={styles.statPill}>
    <Text style={styles.statPillText}>{icon} {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  // Featured
  featured: {
    width: width - 32,
    height: 440,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  featuredTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    paddingTop: spacing.lg,
  },
  heartBtn: {
    marginLeft: 'auto',
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  featuredBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.base,
    paddingBottom: 20,
  },
  featuredPrice: {
    color: colors.white,
    fontSize: typography.fontSize['3xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  featuredTitle: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    marginTop: 2,
  },
  featuredAddress: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  statPill: {
    backgroundColor: colors.glass,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  statPillText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
  },

  // List
  listCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    marginBottom: 12,
  },
  listImage: {
    width: 110,
    height: 110,
  },
  listAIBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(139,92,246,0.85)',
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  listAIText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  listTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listPrice: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  listTitle: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    marginTop: 2,
  },
  listAddress: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  listStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  statText: {
    color: colors.gray300,
    fontSize: typography.fontSize.xs,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gray500,
  },
  listHeart: {
    padding: 12,
    justifyContent: 'center',
  },

  // Compact
  compact: {
    width: 200,
    height: 260,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginRight: 12,
  },
  compactImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  compactGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  compactTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },
  compactBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  compactPrice: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
  },
  compactTitle: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    marginTop: 2,
  },
  compactCity: {
    color: colors.gray300,
    fontSize: typography.fontSize.xs,
  },
  compactStats: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  compactStat: {
    color: colors.gray200,
    fontSize: 11,
  },
});
