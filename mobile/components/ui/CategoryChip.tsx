import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radius, FontSize, Spacing } from '../../constants/theme';

interface CategoryChipProps {
  categories: { id: string; name: string; icon: string; color: string; bgColor: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryChip({
  categories,
  selected,
  onSelect,
}: CategoryChipProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? cat.color : cat.bgColor,
                borderColor: isSelected ? cat.color : 'transparent',
              },
            ]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={cat.icon as any}
              size={16}
              color={isSelected ? '#fff' : cat.color}
              style={styles.chipIcon}
            />
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#fff' : Colors.textPrimaryLight },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    marginRight: Spacing.xs,
  },
  chipIcon: {
    marginRight: Spacing.xs,
  },
  chipText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: FontSize.xs + 1,
  },
});
