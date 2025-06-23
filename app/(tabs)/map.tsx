import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { 
    evenements, 
    favoris, 
    loading, 
    error,
    ajouterFavori, 
    retirerFavori,
    rechercherEvenements,
    rafraichirEvenements 
  } = useAppContext();
  const { theme, colors } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(false);
  const [locationPermission, setLocationPermission] = useState<string>('unknown');
  const [searchText, setSearchText] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(evenements);
  const [isSearching, setIsSearching] = useState(false);

  // Gestionnaire de swipe
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt: any, gestureState: any) => {
      // Détecter un swipe vertical
      return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 20;
    },
    onPanResponderMove: (evt: any, gestureState: any) => {
      // Optionnel: ajouter feedback visuel pendant le swipe
    },
    onPanResponderRelease: (evt: any, gestureState: any) => {
      // Swipe up (dy négatif) ou swipe down (dy positif)
      if (Math.abs(gestureState.dy) > 50) {
        if (gestureState.dy < -50 && !showEvents) {
          // Swipe up: afficher les événements
          setShowEvents(true);
        } else if (gestureState.dy > 50 && showEvents) {
          // Swipe down: retour à la carte
          setShowEvents(false);
        }
      }
    },
  });

  useEffect(() => {
    getLocationPermission();
  }, []);

  // Mettre à jour les événements filtrés quand les événements changent
  useEffect(() => {
    setFilteredEvents(evenements);
  }, [evenements]);

  // Gérer la recherche
  useEffect(() => {
    const handleSearch = async () => {
      if (searchText.trim() === '') {
        setFilteredEvents(evenements);
        setIsSearching(false);
      } else if (searchText.trim().length > 2) {
        setIsSearching(true);
        try {
          const results = await rechercherEvenements(searchText.trim());
          setFilteredEvents(results);
        } catch (error) {
          console.error('Erreur de recherche:', error);
          setFilteredEvents([]);
        } finally {
          setIsSearching(false);
        }
      }
    };

    const timeoutId = setTimeout(handleSearch, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [searchText, rechercherEvenements, evenements]);

  const getLocationPermission = async () => {
    try {
      // Vérifier d'abord si on a déjà la permission
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(existingStatus);
      
      if (existingStatus !== 'granted') {
        // Demander la permission avec une explication
        Alert.alert(
          'Localisation requise',
          'Spota a besoin d\'accéder à votre position pour vous montrer les événements près de vous sur la carte.',
          [
            {
              text: 'Refuser',
              style: 'cancel'
            },
            {
              text: 'Autoriser',
              onPress: async () => {
                const { status } = await Location.requestForegroundPermissionsAsync();
                setLocationPermission(status);
                if (status === 'granted') {
                  getCurrentLocation();
                } else {
                  Alert.alert(
                    'Permission refusée',
                    'Vous pouvez toujours voir les événements sur la carte, mais nous ne pourrons pas vous localiser.',
                    [{ text: 'OK' }]
                  );
                }
              }
            }
          ]
        );
      } else {
        getCurrentLocation();
      }
    } catch (error) {
      console.log('Erreur de géolocalisation:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
      
      // Optionnel: centrer la carte sur la position de l'utilisateur
      Alert.alert(
        'Position trouvée !',
        'Votre position a été détectée. La carte va se centrer sur votre localisation.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('Erreur pour obtenir la position:', error);
      Alert.alert(
        'Erreur de localisation',
        'Impossible d\'obtenir votre position. Vérifiez que le GPS est activé.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleFavori = (eventId: string) => {
    if (favoris.includes(eventId)) {
      retirerFavori(eventId);
    } else {
      ajouterFavori(eventId);
    }
  };

  const navigateToEventDetail = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const navigateToProfile = () => {
    router.push('/(tabs)/profile');
  };

  const getMarkerColor = (categorie: string) => {
    switch (categorie) {
      case 'Musique': return '#7f7fff';
      case 'Art': return '#ff6f91';
      case 'Sport': return '#4ecdc4';
      case 'Culture': return '#6fffbf';
      case 'Nature': return '#a8e6cf';
      case 'Famille': return '#ffa8a8';
      default: return '#FFD36F';
    }
  };

  // Filtrer les événements avec coordonnées valides pour la carte (limiter à 20 pour performance)
  const eventsForMap = filteredEvents
    .filter(event => event.latitude && event.longitude && 
            event.latitude !== 0 && event.longitude !== 0)
    .slice(0, 20);

  // Génération du HTML pour la carte avec style adapté au thème
  const generateHTML = () => {
    const isDark = theme === 'dark';
    
    const markers = eventsForMap.map(event => `
      L.marker([${event.latitude}, ${event.longitude}], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: ${getMarkerColor(event.categorie || 'Culture')}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        })
      }).addTo(map).on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'markerClick',
          eventId: '${event.id}'
        }));
      });
    `).join('');

    // Centre de la carte (position utilisateur ou Paris par défaut)
    const centerLat = location?.coords.latitude || 48.8566;
    const centerLon = location?.coords.longitude || 2.3522;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
          <style>
            body, html { margin: 0; padding: 0; height: 100%; }
            #map { height: 100vh; }
            .custom-marker { border: none; background: none; }
            .leaflet-control-attribution { display: none !important; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map').setView([${centerLat}, ${centerLon}], 13);
            
            // Style de carte adapté au thème
            ${isDark ? `
              L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap, © CartoDB',
                maxZoom: 19
              }).addTo(map);
            ` : `
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
              }).addTo(map);
            `}
            
            // Ajouter marqueur de position utilisateur si disponible
            ${location ? `
              L.marker([${location.coords.latitude}, ${location.coords.longitude}], {
                icon: L.divIcon({
                  className: 'user-marker',
                  html: '<div style="background-color: #2196F3; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                  iconSize: [22, 22],
                  iconAnchor: [11, 11]
                })
              }).addTo(map);
            ` : ''}
            
            // Ajouter les marqueurs d'événements
            ${markers}
          </script>
        </body>
      </html>
    `;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
          <Ionicons 
            name={isSearching ? "hourglass-outline" : "search"} 
            size={18} 
            color="rgba(0, 0, 0, 0.6)" 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[styles.searchInput, { color: 'rgba(0, 0, 0, 0.7)' }]}
            placeholder="Rechercher des événements..."
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="rgba(0, 0, 0, 0.6)" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Avatar de l'utilisateur */}
        <TouchableOpacity style={styles.userAvatarContainer} onPress={navigateToProfile}>
          <View style={[styles.userAvatar, { backgroundColor: '#2ecc71' }]}>
            <Ionicons name="person" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={20} color="rgba(0, 0, 0, 0.7)" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={rafraichirEvenements}
        >
          <Ionicons name="refresh" size={20} color="rgba(0, 0, 0, 0.7)" />
        </TouchableOpacity>
      </View>

      {/* Carte */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="map-outline" size={60} color={colors.textSecondary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Chargement de la carte...
            </Text>
            <Text style={[styles.loadingSubText, { color: colors.textSecondary }]}>
              Récupération des événements parisiens
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={60} color="#ff6b6b" />
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
        ) : (
          <WebView
            source={{ html: generateHTML() }}
            style={styles.map}
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'markerClick') {
                setSelectedEvent(data.eventId);
              }
            }}
          />
        )}
        
        {/* Popup d'événement sélectionné */}
        {selectedEvent && (
          <View style={[styles.eventPopup, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
            {(() => {
              const event = filteredEvents.find(e => e.id === selectedEvent);
              return event ? (
                <View style={[styles.eventPopupCard, { backgroundColor: colors.surface }]}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setSelectedEvent(null)}
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                  
                  <Image 
                    source={{ uri: event.image || 'https://picsum.photos/300/200' }} 
                    style={styles.eventPopupImage} 
                  />
                  
                  <View style={styles.eventPopupContent}>
                    <Text style={[styles.eventPopupTitle, { color: colors.text }]} numberOfLines={2}>
                      {event.titre}
                    </Text>
                    <View style={styles.eventPopupDetails}>
                      <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                      <Text style={[styles.eventPopupLocation, { color: colors.textSecondary }]} numberOfLines={1}>
                        {event.lieu}
                      </Text>
                    </View>
                    <View style={styles.eventPopupDetails}>
                      <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                      <Text style={[styles.eventPopupDate, { color: colors.textSecondary }]} numberOfLines={1}>
                        {event.date}
                      </Text>
                    </View>
                    <Text style={styles.eventPopupPrice}>{event.prix}</Text>
                    
                    <View style={styles.eventPopupActions}>
                      <TouchableOpacity 
                        style={styles.favoriteButton}
                        onPress={() => toggleFavori(event.id)}
                      >
                        <Ionicons 
                          name={favoris.includes(event.id) ? 'heart' : 'heart-outline'} 
                          size={24} 
                          color="#FFD36F" 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.detailButton, { backgroundColor: '#7f7fff' }]}
                        onPress={() => {
                          setSelectedEvent(null);
                          navigateToEventDetail(event.id);
                        }}
                      >
                        <Text style={styles.detailButtonText}>Voir détails</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : null;
            })()}
          </View>
        )}
      </View>

      {/* Section des événements en bas */}
      <View style={[styles.bottomEventsContainer, { backgroundColor: colors.surface }]} {...panResponder.panHandlers}>
        <View style={styles.bottomEventsHandle}>
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
        </View>
        
        <TouchableOpacity
          style={styles.bottomEventsToggle}
          onPress={() => setShowEvents(!showEvents)}
        >
          <Text style={[styles.bottomEventsText, { color: colors.text }]}>
            Événements ({filteredEvents.length})
          </Text>
          <Ionicons name={showEvents ? "chevron-down" : "chevron-up"} size={20} color={colors.text} />
        </TouchableOpacity>
        
        {showEvents && (
          <ScrollView 
            style={styles.bottomEventsList}
            showsVerticalScrollIndicator={false}
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.slice(0, 50).map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={[styles.bottomEventCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => navigateToEventDetail(event.id)}
                >
                  <Image
                    source={{ uri: event.image || 'https://picsum.photos/300/200' }}
                    style={styles.bottomEventImage}
                  />
                  <View style={styles.bottomEventInfo}>
                    <Text style={[styles.bottomEventTitle, { color: colors.text }]} numberOfLines={2}>
                      {event.titre}
                    </Text>
                    <Text style={[styles.bottomEventLocation, { color: colors.textSecondary }]} numberOfLines={1}>
                      {event.lieu}
                    </Text>
                    <Text style={[styles.bottomEventDate, { color: colors.textSecondary }]} numberOfLines={1}>
                      {event.date}
                    </Text>
                    <Text style={styles.bottomEventPrice}>{event.prix}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavori(event.id);
                    }}
                  >
                    <Ionicons 
                      name={favoris.includes(event.id) ? 'heart' : 'heart-outline'} 
                      size={20} 
                      color="#FFD36F" 
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyEventsContainer}>
                <Ionicons name="map-outline" size={60} color={colors.textSecondary} />
                <Text style={[styles.emptyEventsText, { color: colors.text }]}>
                  {isSearching ? 'Recherche en cours...' : 'Aucun événement trouvé'}
                </Text>
                <Text style={[styles.emptyEventsSubText, { color: colors.textSecondary }]}>
                  {searchText ? 'Essayez avec d\'autres mots-clés' : 'Aucun événement disponible pour le moment'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    backdropFilter: 'blur(20px)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  userAvatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtons: {
    position: 'absolute',
    top: 140,
    right: 20,
    zIndex: 1000,
  },
  locationButton: {
    padding: 12,
    borderRadius: 25,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  refreshButton: {
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#7f7fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  eventPopupCard: {
    borderRadius: 16,
    overflow: 'hidden',
    maxWidth: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 120,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  eventPopupImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventPopupContent: {
    padding: 20,
  },
  eventPopupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventPopupDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventPopupLocation: {
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  eventPopupDate: {
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  eventPopupPrice: {
    color: '#FFD36F',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  eventPopupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 12,
    borderRadius: 25,
  },
  detailButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomEventsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: height * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomEventsHandle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  bottomEventsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  bottomEventsText: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomEventsList: {
    maxHeight: height * 0.7,
  },
  bottomEventCard: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  bottomEventImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
  },
  bottomEventInfo: {
    flex: 1,
  },
  bottomEventTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bottomEventLocation: {
    fontSize: 13,
    marginBottom: 2,
  },
  bottomEventDate: {
    fontSize: 13,
    marginBottom: 4,
  },
  bottomEventPrice: {
    color: '#FFD36F',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyEventsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEventsText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyEventsSubText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
}); 