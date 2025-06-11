import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';

const categories = [
  { label: 'Tout', color: '#FFD36F' },
  { label: 'Musique', color: '#7f7fff' },
  { label: 'Art', color: '#ff6f91' },
  { label: 'Découverte', color: '#6fffbf' },
];

export default function DiscoverScreen() {
  const [selectedCat, setSelectedCat] = useState('Tout');
  const { evenements, favoris, ajouterFavori, retirerFavori } = useAppContext();
  const { theme, colors } = useTheme();

  const filtrés = selectedCat === 'Tout' 
    ? evenements 
    : evenements.filter(e => e.categorie === selectedCat);

  const toggleFavori = (id: string) => {
    if (favoris.includes(id)) {
      retirerFavori(id);
    } else {
      ajouterFavori(id);
    }
  };

  const navigateToEventDetail = (id: string) => {
    router.push(`/event/${id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Découvrir</Text>
      
      {/* Filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtres}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.label}
            style={[
              styles.filtreBtn,
              { 
                backgroundColor: selectedCat === cat.label ? cat.color : colors.surface,
              }
            ]}
            onPress={() => setSelectedCat(cat.label)}
          >
            <Text style={[
              styles.filtreText,
              { 
                color: selectedCat === cat.label ? '#000' : colors.text,
              }
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Liste d'événements */}
      <FlatList
        data={filtrés}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => navigateToEventDetail(item.id)}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.titre, { color: colors.text }]}>{item.titre}</Text>
              <Text style={[styles.lieu, { color: colors.textSecondary }]}>{item.lieu} • {item.date}</Text>
              <Text style={styles.prix}>{item.prix}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.plusUnBtn}
                onPress={(e) => {
                  e.stopPropagation(); // Éviter de naviguer vers la page détail
                }}
              >
                <Ionicons name="person-add" size={22} color="#fff" />
                <Text style={styles.plusUnText}>+1 Spontané</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation(); // Éviter de naviguer vers la page détail
                  toggleFavori(item.id);
                }}
              >
                <Ionicons name={favoris.includes(item.id) ? 'heart' : 'heart-outline'} size={26} color="#FFD36F" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 0,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 24,
    marginBottom: 10,
  },
  filtres: {
    flexGrow: 0,
    paddingLeft: 16,
    marginBottom: 10,
  },
  filtreBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 4,
  },
  filtreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  titre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lieu: {
    fontSize: 15,
    marginBottom: 2,
  },
  prix: {
    color: '#FFD36F',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  plusUnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7f7fff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  plusUnText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 15,
  },
}); 