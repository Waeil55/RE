import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../theme';
import { PropertyCard } from '../components/PropertyCard';
import { mockProperties } from '../data/mockData';

export const SavedScreen = ({ navigation }: any) => {
  // Show a subset as "saved" for demo
  const saved = mockProperties.filter((p) => p.isAIEnhanced);

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved</Text>
          <Text style={styles.subtitle}>{saved.length} properties saved</Text>
        </View>

        {saved.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyText}>No saved properties yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the heart icon on any listing to save it here
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => navigation.navigate('Listings')}
            >
              <LinearGradient
                colors={['#0EA5E9', '#38BDF8']}
                style={styles.browseBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.browseBtnText}>Browse Listings</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={saved}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PropertyCard
                property={item}
                variant="list"
                onPress={() =>
                  navigation.navigate('PropertyDetail', { propertyId: item.id })
                }
              />
            )}
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
  subtitle: {
    color: colors.gray400,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.base,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  emptyText: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.gray400,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  browseBtn: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginTop: 24,
  },
  browseBtnGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  browseBtnText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: '800',
  },
});
