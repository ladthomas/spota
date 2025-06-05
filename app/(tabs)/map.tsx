import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppContext } from '../../contexts/AppContext';

const { width, height } = Dimensions.get('window');

// Fake data d'événements avec coordonnées Paris
const fakeEventsWithCoords = [
  {
    id: '1',
    titre: 'Concert Jazz au Sunset',
    lieu: 'Sunset Sunside',
    date: 'Ce soir, 20h30',
    prix: '25€',
    categorie: 'Musique',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: '2',
    titre: 'Exposition Picasso',
    lieu: 'Musée Picasso',
    date: 'Jusqu\'au 15 mars',
    prix: '16€',
    categorie: 'Art',
    latitude: 48.8596,
    longitude: 2.3626,
  },
  {
    id: '3',
    titre: 'Marché aux Puces',
    lieu: 'Saint-Ouen',
    date: 'Week-end, 9h-18h',
    prix: 'Gratuit',
    categorie: 'Découverte',
    latitude: 48.9014,
    longitude: 2.3317,
  },
  {
    id: '4',
    titre: 'Balade Seine',
    lieu: 'Pont Neuf',
    date: 'Demain, 14h00',
    prix: 'Gratuit',
    categorie: 'Découverte',
    latitude: 48.8566,
    longitude: 2.3412,
  },
  {
    id: '5',
    titre: 'Club de Danse',
    lieu: 'Studio Harmonic',
    date: 'Mardi, 19h00',
    prix: '15€',
    categorie: 'Sport',
    latitude: 48.8738,
    longitude: 2.3448,
  },
];

export default function MapScreen() {
  const { favoris, ajouterFavori, retirerFavori } = useAppContext();
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

  // Générer les marqueurs pour Google Maps
  const generateMarkers = () => {
    return fakeEventsWithCoords.map((event, index) => {
      return `
        var marker${index} = new google.maps.Marker({
          position: { lat: ${event.latitude}, lng: ${event.longitude} },
          map: map,
          title: "${event.titre}",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "${getMarkerColor(event.categorie)}",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
          }
        });
        
        marker${index}.addListener('click', function() {
          window.ReactNativeWebView.postMessage('${event.id}');
        });
      `;
    }).join('\n');
  };

  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        function initMap() {
          var center = {lat: 48.8566, lng: 2.3522};
          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: center,
            styles: [
              {
                "elementType": "geometry",
                "stylers": [{"color": "#212121"}]
              },
              {
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#212121"}]
              },
              {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{"color": "#757575"}]
              },
              {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#2c2c2c"}]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#000000"}]
              }
            ]
          });

          ${generateMarkers()}
        }
      </script>
      <script async defer 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC8KbVqEXAJErTOTFi88bocySJOl5OeVEs&callback=initMap">
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Carte des événements</Text>
            <Text style={styles.headerSubtitle}>Découvrez les sorties près de vous</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggleButton, showEvents && styles.toggleButtonActive]}
            onPress={() => setShowEvents(!showEvents)}
          >
            <Ionicons 
              name={showEvents ? "map" : "list"} 
              size={20} 
              color={showEvents ? "#18171c" : "#fff"} 
            />
            <Text style={[styles.toggleButtonText, showEvents && styles.toggleButtonTextActive]}>
              {showEvents ? "Carte" : "Liste"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {!showEvents ? (
        /* Map */
        <View style={styles.mapContainer}>
          <WebView
            style={styles.webview}
            source={{ html: mapHTML }}
            onMessage={(event) => {
              const eventId = event.nativeEvent.data;
              setSelectedEvent(eventId);
              setShowEvents(true); // Passer en mode liste quand on clique sur un marqueur
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />

          {/* Location button */}
          <TouchableOpacity 
            style={[
              styles.locationButton,
              locationPermission === 'granted' && styles.locationButtonActive
            ]}
            onPress={getLocationPermission}
          >
            <Ionicons 
              name={locationPermission === 'granted' ? "locate" : "location-outline"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>

          {/* Bottom preview */}
          <View style={styles.bottomPreview}>
            <TouchableOpacity 
              style={styles.previewButton}
              onPress={() => setShowEvents(true)}
            >
              <Text style={styles.previewText}>
                {fakeEventsWithCoords.length} événements à proximité
              </Text>
              <Ionicons name="chevron-up" size={20} color="#7f7fff" />
            </TouchableOpacity>
            <View style={styles.swipeIndicator}>
              <Text style={styles.swipeText}>Glissez vers le haut pour voir plus</Text>
            </View>
          </View>
        </View>
      ) : (
        /* Events List */
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsTitle}>Événements à proximité</Text>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.eventsListVertical}
          >
            {fakeEventsWithCoords.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventCardVertical,
                  selectedEvent === event.id && styles.selectedEventCard
                ]}
                onPress={() => setSelectedEvent(event.id)}
              >
                <View style={styles.eventHeader}>
                  <View style={[styles.categoryDot, { backgroundColor: getMarkerColor(event.categorie) }]} />
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
                </View>
                
                <Text style={styles.eventTitle}>{event.titre}</Text>
                <Text style={styles.eventLocation}>{event.lieu}</Text>
                <Text style={styles.eventTime}>{event.date}</Text>
                <Text style={styles.eventPrice}>{event.prix}</Text>
                
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigateToEventDetail(event.id)}
                >
                  <Text style={styles.detailsButtonText}>Voir détails</Text>
                  <Ionicons name="arrow-forward" size={16} color="#7f7fff" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
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
    paddingBottom: 15,
    backgroundColor: '#18171c',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#b0b0b0',
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#7f7fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  locationButtonActive: {
    backgroundColor: '#FFD36F',
  },
  bottomSheet: {
    backgroundColor: '#18171c',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 250,
  },
  bottomSheetTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  eventsList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  eventCard: {
    width: 200,
    backgroundColor: '#23202a',
    borderRadius: 16,
    padding: 16,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEventCard: {
    borderColor: '#FFD36F',
    backgroundColor: '#2a2730',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  eventLocation: {
    color: '#b0b0b0',
    fontSize: 13,
    marginBottom: 3,
  },
  eventTime: {
    color: '#b0b0b0',
    fontSize: 13,
    marginBottom: 6,
  },
  eventPrice: {
    color: '#FFD36F',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(127, 127, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#7f7fff',
  },
  detailsButtonText: {
    color: '#7f7fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23202a',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#7f7fff',
  },
  toggleButtonActive: {
    backgroundColor: '#FFD36F',
    borderColor: '#FFD36F',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  toggleButtonTextActive: {
    color: '#18171c',
  },
  bottomPreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#18171c',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 15,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  previewText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  eventsListVertical: {
    paddingBottom: 100,
  },
  eventCardVertical: {
    backgroundColor: '#23202a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swipeIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  swipeText: {
    color: '#7f7fff',
    fontSize: 12,
    fontStyle: 'italic',
  },
}); 