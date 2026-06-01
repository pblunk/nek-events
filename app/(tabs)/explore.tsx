import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GuideCard } from '@/components/GuideCard';
import { theme } from '@/constants/Colors';
import { importedPlaces, placeCategories, placeTowns } from '@/data/places';
import { GuideCategory } from '@/types/guide';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<GuideCategory[]>([]);
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return importedPlaces.filter((place) => {
      const matchesSearch = normalizedQuery.length === 0 || place.title.toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(place.category);
      const filterTown = place.detectedTown ?? place.sourceTown ?? place.location.town;
      const matchesTown = selectedTowns.length === 0 || selectedTowns.includes(filterTown);

      return matchesSearch && matchesCategory && matchesTown;
    });
  }, [searchQuery, selectedCategories, selectedTowns]);

  const activeFilterCount = selectedCategories.length + selectedTowns.length;
  const toggleCategory = (category: GuideCategory) => {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((currentCategory) => currentCategory !== category)
        : [...currentCategories, category],
    );
  };

  const toggleTown = (town: string) => {
    setSelectedTowns((currentTowns) =>
      currentTowns.includes(town) ? currentTowns.filter((currentTown) => currentTown !== town) : [...currentTowns, town],
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTowns([]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.filterBar}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search places"
          placeholderTextColor={theme.colors.muted}
          style={styles.searchInput}
        />
        <Pressable style={styles.filterButton} onPress={() => setFiltersOpen((open) => !open)}>
          <Text style={styles.filterButtonText}>
            {activeFilterCount === 0 ? 'Filters' : `Filters · ${activeFilterCount} active`}
          </Text>
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.count}>{filteredPlaces.length} places</Text>
        <View style={styles.summaryMeta}>
          <Text style={styles.filterSummary}>
            {activeFilterCount === 0 ? 'No filters active' : `${activeFilterCount} filters active`}
          </Text>
          {activeFilterCount > 0 ? (
            <Pressable onPress={clearFilters}>
              <Text style={styles.clearInlineText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {filtersOpen ? (
        <View style={styles.filterPanel}>
          {activeFilterCount > 0 ? (
            <FlatList
              horizontal
              data={[...selectedCategories, ...selectedTowns]}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeChipList}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.activeChip}
                  onPress={() =>
                    selectedCategories.includes(item as GuideCategory)
                      ? toggleCategory(item as GuideCategory)
                      : toggleTown(item)
                  }>
                  <Text style={styles.activeChipText}>{item} x</Text>
                </Pressable>
              )}
            />
          ) : null}

          <FilterRow
            title="Category"
            options={placeCategories}
            selected={selectedCategories}
            onToggle={(value) => toggleCategory(value as GuideCategory)}
          />

          <FilterRow title="Town" options={placeTowns} selected={selectedTowns} onToggle={toggleTown} />

          <View style={styles.filterActions}>
            <Pressable style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear filters</Text>
            </Pressable>
            <Pressable style={styles.doneButton} onPress={() => setFiltersOpen(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/details/[id]', params: { id: item.id } }} asChild>
            <Pressable style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}>
              <GuideCard item={item} compact />
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

function FilterRow({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterTitle}>{title}</Text>
      <FlatList
        horizontal
        data={options}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <Pressable style={[styles.chip, selected.includes(item) && styles.chipSelected]} onPress={() => onToggle(item)}>
            <Text style={[styles.chipText, selected.includes(item) && styles.chipTextSelected]}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    paddingBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.slate,
    fontSize: 30,
    fontWeight: '800',
  },
  searchInput: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.slate,
    fontSize: 16,
    padding: theme.spacing.md,
    width: '100%',
  },
  filterGroup: {
    marginTop: theme.spacing.sm,
  },
  filterTitle: {
    color: theme.colors.slate,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  filterList: {
    gap: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  chipSelected: {
    backgroundColor: theme.colors.deepForest,
    borderColor: theme.colors.deepForest,
  },
  chipText: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: theme.colors.buttonCream,
  },
  count: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  filterBar: {
    gap: theme.spacing.sm,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.deepForest,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    width: '100%',
  },
  filterButtonText: {
    color: theme.colors.buttonCream,
    fontSize: 14,
    fontWeight: '800',
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  summaryMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterSummary: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  clearInlineText: {
    color: theme.colors.forestGreen,
    fontSize: 13,
    fontWeight: '800',
  },
  activeChipList: {
    gap: theme.spacing.sm,
    minHeight: 38,
    paddingBottom: theme.spacing.sm,
  },
  activeChip: {
    backgroundColor: theme.colors.deepForest,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  activeChipText: {
    color: theme.colors.buttonCream,
    fontSize: 13,
    fontWeight: '800',
  },
  filterPanel: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  filterActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
  },
  clearButton: {
    borderColor: theme.colors.forestGreen,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  clearButtonText: {
    color: theme.colors.forestGreen,
    fontSize: 13,
    fontWeight: '800',
  },
  doneButton: {
    backgroundColor: theme.colors.forestGreen,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  doneButtonText: {
    color: theme.colors.buttonCream,
    fontSize: 13,
    fontWeight: '800',
  },
  listContent: {
    gap: theme.spacing.md,
    paddingTop: 0,
    paddingBottom: 112,
  },
  cardPressable: {
    borderRadius: theme.radius.sm,
  },
  cardPressed: {
    opacity: 0.85,
  },
});
