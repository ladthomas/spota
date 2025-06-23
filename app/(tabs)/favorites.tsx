import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { cleanHtmlText } from '../../utils/textHelpers';

export default function FavoritesScreen() {
  const { evenements, favoris, retirerFavori } = useAppContext();
  const { theme, colors } = useTheme();
  
  // Filtrer les événements qui sont dans les favoris
  const evenementsFavoris = evenements.filter(ev => favoris.includes(ev.id));

  const navigateToEventDetail = (id: string) => {
    router.push(`/event/${id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Mes Favoris</Text>
      {evenementsFavoris.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={60} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>Pas encore de favoris</Text>
          <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>Ajoute des événements en cliquant sur le cœur</Text>
        </View>
      ) : (
        <FlatList
          data={evenementsFavoris}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: colors.surface }]}
              onPress={() => navigateToEventDetail(item.id)}
              activeOpacity={0.7}
            >
              <View style={{flex: 1}}>
                <Text style={[styles.titre, { color: colors.text }]}>{cleanHtmlText(item.titre)}</Text>
                <Text style={[styles.lieu, { color: colors.textSecondary }]}>{cleanHtmlText(item.lieu)} • {cleanHtmlText(item.date)}</Text>
                <Text style={styles.prix}>{cleanHtmlText(item.prix)}</Text>
              </View>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation(); // Éviter de naviguer vers la page détail
                  retirerFavori(item.id);
                }}
              >
                <Ionicons name="heart" size={26} color="#FFD36F" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171c',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '70%',
  },
  card: {
    backgroundColor: '#23202a',
    borderRadius: 18,
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
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lieu: {
    color: '#b0b0b0',
    fontSize: 15,
    marginBottom: 2,
  },
  prix: {
    color: '#FFD36F',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 