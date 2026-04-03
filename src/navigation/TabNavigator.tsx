import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, typography } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { ListingsScreen } from '../screens/ListingsScreen';
import { EnhanceScreen } from '../screens/EnhanceScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: '🏠', inactive: '🏠' },
  Listings: { active: '🔍', inactive: '🔍' },
  Enhance: { active: '✦', inactive: '✦' },
  Saved: { active: '❤️', inactive: '🤍' },
  Profile: { active: '👤', inactive: '👤' },
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarWrap}>
      <View style={styles.tabBar}>
        <LinearGradient
          colors={['rgba(15,23,42,0.98)', 'rgba(15,23,42,1)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tabBarBorder} />
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isEnhance = route.name === 'Enhance';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isEnhance) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.enhanceTab}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#6D28D9', '#7C3AED', '#8B5CF6']}
                  style={styles.enhanceTabGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.enhanceIcon}>✦</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabIcon,
                  { opacity: isFocused ? 1 : 0.5 },
                ]}
              >
                {isFocused
                  ? TAB_ICONS[route.name]?.active
                  : TAB_ICONS[route.name]?.inactive}
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? colors.accent : colors.gray500 },
                ]}
              >
                {route.name}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Listings" component={ListingsScreen} />
      <Tab.Screen name="Enhance" component={EnhanceScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: radius['2xl'],
    paddingVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  enhanceTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enhanceTabGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  enhanceIcon: {
    fontSize: 22,
    color: colors.white,
  },
});
