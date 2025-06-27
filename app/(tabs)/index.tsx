import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { cleanHtmlText } from '../../utils/textHelpers';

const categories = [
 /* { id: 'all', nom: 'Tout', icon: 'grid', color: '#7f7fff' },*/  /* suppresiion du bouton dans la nav categorie */
  { id: '1', nom: 'Musique', icon: 'musical-notes', color: '#FFD36F' },
  { id: '2', nom: 'Art', icon: 'color-palette', color: '#ff6f91' },
  { id: '3', nom: 'Sport', icon: 'fitness', color: '#7f7fff' },
  { id: '4', nom: 'Food', icon: 'restaurant', color: '#4ecdc4' },
  { id: '5', nom: 'Tech', icon: 'laptop', color: '#95e1d3' },
  { id: '6', nom: 'Nature', icon: 'leaf', color: '#a8e6cf' },
];

export default function AccueilScreen() {
  const router = useRouter();
  const { 
    evenements, 
    favoris, 
    loading, 
    error,
    ajouterFavori, 
    retirerFavori,
    rafraichirEvenements 
  } = useAppContext();
  const { theme, colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filtrer les événements selon la recherche et la catégorie
  const evenementsFiltres = evenements.filter(event => {
    const matchSearch = event.titre.toLowerCase().includes(searchText.toLowerCase()) ||
                       event.lieu.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = selectedCategory === '' || event.categorie === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Toggle favori
  const toggleFavori = (eventId: string) => {
    if (favoris.includes(eventId)) {
      retirerFavori(eventId);
    } else {
      ajouterFavori(eventId);
    }
  };

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { backgroundColor: colors.surface },
        (selectedCategory === item.nom || (item.nom === 'Tout' && selectedCategory === '')) && styles.categoryCardSelected
      ]}
      onPress={() => {
        if (item.nom === 'Tout') {
          setSelectedCategory('');
        } else {
          setSelectedCategory(selectedCategory === item.nom ? '' : item.nom);
        }
      }}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#fff" />
      </View>
      <Text style={[styles.categoryText, { color: colors.text }]}>{item.nom}</Text>
    </TouchableOpacity>
  );

  const renderEvent = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/event/${item.id}`)}
    >
      <Image
        source={{ uri: item.image || 'https://picsum.photos/300/200' }}
        style={styles.eventImage}
      />
      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => toggleFavori(item.id)}
      >
        <Ionicons
          name={favoris.includes(item.id) ? 'heart' : 'heart-outline'}
          size={20}
          color="#FFD36F"
        />
      </TouchableOpacity>
      
      <View style={styles.eventInfo}>
        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
          {cleanHtmlText(item.titre)}
        </Text>
        <View style={styles.eventDetails}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.eventLocation, { color: colors.textSecondary }]} numberOfLines={1}>
            {cleanHtmlText(item.lieu)}
          </Text>
        </View>
        <View style={styles.eventDetails}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.eventTime, { color: colors.textSecondary }]} numberOfLines={1}>
            {cleanHtmlText(item.date)}
          </Text>
        </View>
        <Text style={styles.eventPrice}>{cleanHtmlText(item.prix)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Salut ! 👋</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Que veux-tu faire aujourd'hui ?</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-circle" size={32} color="#FFD36F" />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher des événements..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Catégories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Catégories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Boutons d'action rapide */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/map')}
          >
            <Ionicons name="map" size={24} color="#fff" />
            <Text style={styles.quickActionText}>Carte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#4ecdc4' }]}
            onPress={() => router.push('/favorites')}
          >
            <Ionicons name="heart" size={24} color="#fff" />
            <Text style={styles.quickActionText}>Favoris</Text>
          </TouchableOpacity>
        </View>

        {/* Événements recommandés */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory ? `Événements ${selectedCategory}` : 'Événements parisiens'}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/map')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {/* État de chargement */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={40} color={colors.textSecondary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Chargement des événements...
              </Text>
              <Text style={[styles.loadingSubText, { color: colors.textSecondary }]}>
                Récupération depuis l'API officielle de Paris
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning-outline" size={40} color="#ff6b6b" />
              <Text style={[styles.errorText, { color: colors.text }]}>
                Erreur de chargement
              </Text>
              <Text style={[styles.errorSubText, { color: colors.textSecondary }]}>
                {error}
              </Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={rafraichirEvenements}
              >
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : evenementsFiltres.length > 0 ? (
            <FlatList
              data={evenementsFiltres.slice(0, 6)}
              renderItem={renderEvent}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.eventRow}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.text }]}>Aucun événement trouvé</Text>
              <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
                {searchText || selectedCategory 
                  ? 'Essayez avec d\'autres mots-clés ou explorez toutes les catégories'
                  : 'Aucun événement disponible pour le moment'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171c',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#18171c',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    marginTop: 4,
  },
  profileButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23202a',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    color: '#7f7fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesList: {
    paddingVertical: 10,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#23202a',
    minWidth: 80,
  },
  categoryCardSelected: {
    backgroundColor: '#7f7fff',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionButton: {
    backgroundColor: '#7f7fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  eventRow: {
    justifyContent: 'space-between',
  },
  eventCard: {
    backgroundColor: '#23202a',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    width: '48%',
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLocation: {
    color: '#b0b0b0',
    fontSize: 12,
    marginLeft: 4,
  },
  eventTime: {
    color: '#b0b0b0',
    fontSize: 12,
    marginLeft: 4,
  },
  eventPrice: {
    color: '#FFD36F',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubText: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingSubText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorSubText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#7f7fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 