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
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

// Fake data d'événements avec coordonnées Paris et images - TOUS les événements
const allEventsWithCoords = [
  {
    id: '1',
    titre: 'Shibari & Tantra',
    lieu: 'Studio Parisien',
    date: '+1 de plus',
    prix: 'Gratuit',
    categorie: 'Art',
    latitude: 48.8366,
    longitude: 2.3222,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop&crop=center',
    description: 'Atelier découverte art corporel',
  },
  {
    id: '2',
    titre: 'POLARNY',
    lieu: 'Salle Wagram',
    date: 'Ce soir, 20h30',
    prix: '25€',
    categorie: 'Musique',
    latitude: 48.8796,
    longitude: 2.3526,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop&crop=center',
    description: 'Concert électro ambient',
  },
  {
    id: '3',
    titre: 'Be Théo',
    lieu: 'Café des Arts',
    date: 'Demain, 18h00',
    prix: '15€',
    categorie: 'Art',
    latitude: 48.8666,
    longitude: 2.3412,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop&crop=center',
    description: 'Performance artistique',
  },
  {
    id: '4',
    titre: 'Rituel Guérisseur d\'Agni',
    lieu: 'Centre Holistique',
    date: '+2 de plus',
    prix: '30€',
    categorie: 'Bien-être',
    latitude: 48.8166,
    longitude: 2.3012,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center',
    description: 'Cérémonie de guérison par le feu',
  },
  {
    id: '5',
    titre: 'Thalya Fundraising Celebration Party',
    lieu: 'Rooftop Montparnasse',
    date: '+3 de plus',
    prix: '20€',
    categorie: 'Social',
    latitude: 48.8866,
    longitude: 2.3512,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop&crop=center',
    description: 'Soirée caritative avec vue panoramique',
  },
];

// Événements affichés sur la carte (réduit pour une meilleure visibilité)
const fakeEventsWithCoords = allEventsWithCoords.slice(0, 3);

export default function MapScreen() {
  const { favoris, ajouterFavori, retirerFavori } = useAppContext();
  const { theme, colors } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(false);
  const [locationPermission, setLocationPermission] = useState<string>('unknown');

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

  const getMarkerColor = (categorie: string) => {
    switch (categorie) {
      case 'Musique': return '#7f7fff';
      case 'Art': return '#ff6f91';
      case 'Sport': return '#4ecdc4';
      case 'Découverte': return '#6fffbf';
      default: return '#FFD36F';
    }
  };

  // Génération du HTML pour la carte avec style adapté au thème
  const generateHTML = () => {
    const isDark = theme === 'dark';
    const mapStyle = isDark ? 
      // Style sombre pour Google Maps
      `[
        { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
        { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
        { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
        { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
        { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
        { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
        { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
        { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
        { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
        { "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1b1b1b" }] },
        { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
        { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
        { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] },
        { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
        { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] },
        { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
        { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
        { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
      ]` : 
      // Style clair par défaut
      `[]`;

    const markers = fakeEventsWithCoords.map(event => `
      L.marker([${event.latitude}, ${event.longitude}], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: ${getMarkerColor(event.categorie)}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
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
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map').setView([48.8566, 2.3522], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            ${markers}
          </script>
        </body>
      </html>
    `;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Button de géolocalisation */}
      <TouchableOpacity 
        style={[styles.locationButton, { backgroundColor: colors.surface }]}
        onPress={getCurrentLocation}
      >
        <Ionicons name="locate" size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Carte */}
      <View style={styles.mapContainer}>
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
        
        {/* Popup d'événement sélectionné */}
        {selectedEvent && (
          <View style={[styles.eventPopup, { backgroundColor: colors.surface }]}>
            {(() => {
              const event = allEventsWithCoords.find(e => e.id === selectedEvent);
              return event ? (
                <>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setSelectedEvent(null)}
                  >
                    <Ionicons name="close" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Image source={{ uri: event.image }} style={styles.eventPopupImage} />
                  <View style={styles.eventPopupContent}>
                    <Text style={[styles.eventPopupTitle, { color: colors.text }]}>{event.titre}</Text>
                    <Text style={[styles.eventPopupLocation, { color: colors.textSecondary }]}>{event.lieu}</Text>
                    <Text style={[styles.eventPopupDate, { color: colors.textSecondary }]}>{event.date}</Text>
                    <Text style={styles.eventPopupPrice}>{event.prix}</Text>
                    <View style={styles.eventPopupActions}>
                      <TouchableOpacity 
                        style={styles.favoriteButton}
                        onPress={() => toggleFavori(event.id)}
                      >
                        <Ionicons 
                          name={favoris.includes(event.id) ? 'heart' : 'heart-outline'} 
                          size={20} 
                          color="#FFD36F" 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.detailButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigateToEventDetail(event.id)}
                      >
                        <Text style={styles.detailButtonText}>Voir détails</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
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
            {allEventsWithCoords.length} Événements
          </Text>
          <Ionicons name={showEvents ? "chevron-down" : "chevron-up"} size={20} color={colors.text} />
        </TouchableOpacity>
        
        {showEvents && (
          <ScrollView 
            style={styles.bottomEventsList}
            showsVerticalScrollIndicator={false}
          >
            {allEventsWithCoords.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.bottomEventCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => navigateToEventDetail(event.id)}
              >
                <Image
                  source={{ uri: event.image }}
                  style={styles.bottomEventImage}
                />
                <View style={styles.bottomEventInfo}>
                  <Text style={[styles.bottomEventTitle, { color: colors.text }]}>{event.titre}</Text>
                  <Text style={[styles.bottomEventDate, { color: colors.textSecondary }]}>{event.date}</Text>
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
            ))}
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
  locationButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 12,
    borderRadius: 25,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  eventPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  eventPopupImage: {
    width: '80%',
    height: '80%',
    borderRadius: 10,
  },
  eventPopupContent: {
    padding: 20,
    borderRadius: 10,
    maxWidth: '80%',
    maxHeight: '80%',
    justifyContent: 'center',
  },
  eventPopupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventPopupLocation: {
    fontSize: 14,
    marginBottom: 10,
  },
  eventPopupDate: {
    fontSize: 14,
  },
  eventPopupPrice: {
    color: '#FFD36F',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  eventPopupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 20,
  },
  detailButton: {
    padding: 10,
    borderRadius: 20,
  },
  detailButtonText: {
    fontSize: 14,
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
  bottomEventDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  bottomEventPrice: {
    color: '#FFD36F',
    fontSize: 14,
    fontWeight: '600',
  },
}); 