import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../../store/useAppStore';
import GradientButton from '../../components/ui/GradientButton';
import { Colors, Gradients } from '../../constants/colors';
import { FontSize, Spacing, Radius } from '../../constants/theme';

const slides = [
  {
    id: '1',
    title: 'Track Every Rupee,\nEffortlessly',
    subtitle: 'Log expenses in seconds, always know where your money goes.',
    icon: 'wallet-outline' as const,
    iconBg: '#1E2D4A',
    accentIcon: 'add-circle',
  },
  {
    id: '2',
    title: 'Set Budgets,\nStay in Control',
    subtitle: 'Create spending limits for each category and get alerts before you overspend.',
    icon: 'bar-chart-outline' as const,
    iconBg: '#1E3A2F',
    accentIcon: 'checkmark-circle',
  },
  {
    id: '3',
    title: 'Know Where\nYour Money Goes',
    subtitle: 'Beautiful charts and insights reveal your spending patterns at a glance.',
    icon: 'trending-up-outline' as const,
    iconBg: '#2D1E3A',
    accentIcon: 'analytics',
  },
];

export default function SplashScreen() {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      setOnboarded();
      router.replace('/(onboarding)/auth');
    }
  };

  const handleSkip = () => {
    setOnboarded();
    router.replace('/(onboarding)/auth');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <LinearGradient
                colors={['#1A1A2E', '#16213E']}
                style={styles.illustrationBg}
              >
                {/* Decorative rings */}
                <View style={styles.ring1} />
                <View style={styles.ring2} />
                <View style={styles.ring3} />

                {/* Main icon */}
                <View style={[styles.mainIconBg, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={72} color={Colors.accentStart} />
                </View>

                {/* Floating stat cards */}
                <View style={styles.floatCard1}>
                  <Ionicons name="trending-up" size={14} color={Colors.income} />
                  <Text style={styles.floatText}>+₹8,500</Text>
                </View>
                <View style={styles.floatCard2}>
                  <Ionicons name="receipt-outline" size={14} color={Colors.expense} />
                  <Text style={styles.floatText2}>₹1,250</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <GradientButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.ctaBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  illustrationContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden',
    marginBottom: Spacing.xxl,
  },
  illustrationBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(46,217,160,0.1)',
  },
  ring2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(46,217,160,0.15)',
  },
  ring3: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(46,217,160,0.2)',
  },
  mainIconBg: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatCard1: {
    position: 'absolute',
    top: 48,
    right: 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46,217,160,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  floatCard2: {
    position: 'absolute',
    bottom: 48,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,107,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  floatText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FontSize.xs,
    color: Colors.income,
  },
  floatText2: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: FontSize.xs,
    color: Colors.expense,
  },
  content: {
    paddingHorizontal: Spacing.xxl + 8,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: FontSize.xxxl,
    color: Colors.textPrimaryDark,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Spacing.base,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.accentStart,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.textSecondary,
    opacity: 0.4,
  },
  ctaContainer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 48,
  },
  ctaBtn: {
    width: '100%',
  },
});
