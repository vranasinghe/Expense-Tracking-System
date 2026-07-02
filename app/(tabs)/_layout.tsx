import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '../../constants/colors';
import { FontSize, Shadows, Spacing } from '../../constants/theme';
import AddExpenseSheet from '../../components/screens/AddExpenseSheet';
import { useAppStore } from '../../store/useAppStore';

function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const [showAdd, setShowAdd] = useState(false);
  const unreadCount = useAppStore((s) => s.getUnreadNotificationCount());

  const tabs = [
    { name: 'index', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'analytics', label: 'Analytics', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
    { name: 'budgets', label: 'Budgets', icon: 'wallet-outline', activeIcon: 'wallet' },
    { name: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  // Map route names to tab items
  const routeNames = state.routes.map((r: any) => r.name);

  return (
    <>
      <View style={[styles.tabBar, { paddingBottom: insets.bottom + 4 }]}>
        {/* Home */}
        {tabs.slice(0, 2).map((tab) => {
          const routeIndex = routeNames.indexOf(tab.name);
          const isFocused = state.index === routeIndex;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => {
                if (!isFocused) navigation.navigate(tab.name);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={(isFocused ? tab.activeIcon : tab.icon) as any}
                size={24}
                color={isFocused ? Colors.accentStart : Colors.textSecondary}
              />
              <Text style={[styles.tabLabel, { color: isFocused ? Colors.accentStart : Colors.textSecondary }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Center FAB */}
        <View style={styles.fabWrapper}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowAdd(true)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={Gradients.accent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Budgets + Profile */}
        {tabs.slice(2, 4).map((tab) => {
          const routeIndex = routeNames.indexOf(tab.name);
          const isFocused = state.index === routeIndex;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => {
                if (!isFocused) navigation.navigate(tab.name);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={(isFocused ? tab.activeIcon : tab.icon) as any}
                size={24}
                color={isFocused ? Colors.accentStart : Colors.textSecondary}
              />
              <Text style={[styles.tabLabel, { color: isFocused ? Colors.accentStart : Colors.textSecondary }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <AddExpenseSheet visible={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="budgets" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    ...Shadows.fab,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
