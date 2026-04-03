import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { PropertyCard } from '../components/PropertyCard';
import { SearchBar } from '../components/SearchBar';
import { Badge } from '../components/Badge';
import { mockProperties } from '../data/mockData';

const TYPES = ['All', 'House', 'Condo', 'Townhouse'];
const SORT_OPTIONS = ['Newest', 'Price ↑', 'Price ↓', 'Sq Ft'];
const PRICE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under $1M', min: 0, max: 1_000_000 },
  { label: '$1M–$3M', min: 1_000_000, max: 3_000_000 },
  { label: '$3M–$5M', min: 3_000_000, max: 5_000_000 },
  { label: '$5M+', min: 5_000_000, max: Infinity },
];

export const ListingsScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest');
  const [activePriceRange, setActivePriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...mockProperties];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    if (activeType !== 'All') {
      list = list.filter(
        (p) => p.type.toLowerCase() === activeType.toLowerCase()
      );
    }

    const range = PRICE_RANGES[activePriceRange];
    list = list.filter((p) => p.price >= range.min && p.price <= range.max);

    if (activeSort === 'Price ↑') list.sort((a, b) => a.price - b.price);
    else if (activeSort === 'Price ↓') list.sort((a, b) => b.price - a.price);
    else if (activeSort === 'Sq Ft') list.sort((a, b) => b.sqft - a.sqft);

    return list;
  }, [search, activeType, activeSort, activePriceRange]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Listings</Text>
            <Text style={styles.subtitle}>{filtered.length} properties found</Text>
          </View>
          <TouchableOpacity style={styles.mapBtn}>
            <Text style={styles.mapBtnText}>🗺 Map</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="City, address, zip..."
            onFilterPress={() => setShowFilters(!showFilters)}
          />
        </View>

        {/* Type Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setActiveType(type)}
              style={[styles.tab, activeType === type && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeType === type && styles.tabTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.tabDivider} />
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setActiveSort(opt)}
              style={[styles.tab, activeSort === opt && styles.tabSort]}
            >
              <Text style={[styles.tabText, activeSort === opt && styles.tabSortText]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Price filter */}
        {showFilters && (
          <View style={styles.priceFilter}>
            <Text style={styles.priceFilterTitle}>Price Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PRICE_RANGES.map((range, i) => (
                <TouchableOpacity
                  key={range.label}
                  onPress={() => setActivePriceRange(i)}
                  style={[
                    styles.priceChip,
                    activePriceRange === i && styles.priceChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.priceChipText,
                      activePriceRange === i && styles.priceChipTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* AI Enhanced toggle strip */}
        <View style={styles.aiStrip}>
          <LinearGradient
            colors={['rgba(139,92,246,0.08)', 'transparent']}
            style={styles.aiStripGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.aiStripIcon}>✦</Text>
            <Text style={styles.aiStripText}>
              {mockProperties.filter((p) => p.isAIEnhanced).length} listings have AI-enhanced photos
            </Text>
            <Badge label="AI" variant="ai" size="sm" />
          </LinearGradient>
        </View>

        {/* List */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏠</Text>
            <Text style={styles.emptyText}>No properties found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <PropertyCard
                property={item}
                variant="list"
                onPress={() =>
                  navigation.navigate('PropertyDetail', { propertyId: item.id })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    color: colors.white,
    fontSize: typography.fontSize['3xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.gray400,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  mapBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  mapBtnText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: typography.fontSize.sm,
  },
  searchWrap: {
    paddingHorizontal: spacing.base,
    marginBottom: 10,
  },
  tabsScroll: {
    marginBottom: 4,
  },
  tabsContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
  },
  tabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tabSort: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.3)',
  },
  tabText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabSortText: {
    color: colors.accentGold,
  },
  tabDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.glassBorder,
    marginHorizontal: 6,
  },
  priceFilter: {
    paddingHorizontal: spacing.base,
    paddingBottom: 10,
  },
  priceFilterTitle: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginRight: 8,
  },
  priceChipActive: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderColor: colors.accentGold,
  },
  priceChipText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  priceChipTextActive: {
    color: colors.accentGold,
  },
  aiStrip: {
    marginHorizontal: spacing.base,
    marginBottom: 12,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
  },
  aiStripGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  aiStripIcon: {
    color: '#A78BFA',
    fontSize: 14,
  },
  aiStripText: {
    flex: 1,
    color: colors.gray300,
    fontSize: typography.fontSize.xs,
  },
  list: {
    paddingHorizontal: spacing.base,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyText: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
  },
  emptySubtext: {
    color: colors.gray400,
    fontSize: typography.fontSize.base,
    marginTop: 4,
  },
});
