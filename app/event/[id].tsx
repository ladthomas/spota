import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { evenements, favoris, ajouterFavori, retirerFavori } = useAppContext();
  const { theme, colors } = useTheme();
  const [joined, setJoined] = useState(false);
  
  // Trouver l'événement correspondant à l'ID
  const evenement = evenements.find(e => e.id === id);

  // Si l'événement n'est pas trouvé, afficher un message d'erreur
  if (!evenement) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === 'dark' ? "light" : "dark"} />
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>Événement non trouvé</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backToDiscoverButton}>
            <Text style={styles.backToDiscoverText}>Retour à la découverte</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Toggle favori
  const toggleFavori = () => {
    if (favoris.includes(evenement.id)) {
      retirerFavori(evenement.id);
    } else {
      ajouterFavori(evenement.id);
    }
  };

  // Participer à l'événement
  const handleSpontane = () => {
    setJoined(!joined);
    Alert.alert(
      joined ? "Participation annulée" : "C'est noté !",
      joined 
        ? "Vous ne participez plus à cet événement." 
        : "Vous êtes inscrit comme +1 Spontané. Des détails supplémentaires vous seront envoyés prochainement."
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? "light" : "dark"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={toggleFavori} style={styles.favoriteButton}>
          <Ionicons 
            name={favoris.includes(evenement.id) ? 'heart' : 'heart-outline'} 
            size={26} 
            color="#FFD36F" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Image de l'événement */}
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}>
          <Image
            source={{ uri: 'https://picsum.photos/800/500' }}
            style={styles.eventImage}
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{evenement.categorie || 'Événement'}</Text>
          </View>
        </View>

        {/* Titre et info basiques */}
        <View style={styles.titleContainer}>
          <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Aujourd'hui, {evenement.date}</Text>
        </View>

        {/* Actions principales */}
        <View style={styles.mainActionsContainer}>
          <TouchableOpacity 
            style={[styles.spontaneBtn, joined && styles.spontaneBtnActive]}
            onPress={handleSpontane}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.spontaneText}>
              {joined ? "Je participe" : "+1 Spontané"}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mail-outline" size={28} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share-social-outline" size={28} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Lieu */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Lieu</Text>
          <View style={[styles.locationCard, { backgroundColor: colors.surface }]}>
            <View style={styles.locationDetails}>
              <Text style={[styles.locationTitle, { color: colors.text }]}>{evenement.lieu}</Text>
              <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>Paris, Île-de-France</Text>
              <TouchableOpacity style={styles.directionButton}>
                <Text style={styles.directionText}>Itinéraire</Text>
                <Ionicons name="arrow-forward" size={16} color="#7f7fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.mapPreview}>
              <Image 
                source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=48.866,2.333&zoom=15&size=120x120&maptype=roadmap&style=element:geometry%7Ccolor:0x212121&style=element:labels.icon%7Cvisibility:off&key=YOUR_API_KEY' }}
                style={styles.mapImage}
              />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>À propos de l'événement</Text>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            La French Stack #002 — Code Legacy

            Rejoignez-nous pour cette deuxième édition de la French Stack, où nous échangerons sur les bonnes pratiques de développement et la gestion de la dette technique.

            Au programme :
            • Présentations de cas pratiques
            • Ateliers collaboratifs
            • Networking entre passionnés de tech

            Tous les détails seront partagés avant le jour J. Vous pourrez profiter d'une ambiance conviviale et rencontrer de nouvelles personnes partageant vos intérêts.
          </Text>
        </View>

        {/* Prix */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Prix</Text>
          <View style={styles.priceContainer}>
            <Ionicons name="cash-outline" size={22} color="#FFD36F" />
            <Text style={styles.priceLabel}>{evenement.prix}</Text>
          </View>
        </View>

        {/* Espace en bas */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  favoriteButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    maxWidth: '70%',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#FFD36F',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  categoryText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  titleContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  dateLabel: {
    fontSize: 18,
  },
  mainActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  spontaneBtn: {
    backgroundColor: '#7f7fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  spontaneBtnActive: {
    backgroundColor: '#6c58f5',
  },
  spontaneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  locationCard: {
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
  },
  locationDetails: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    marginBottom: 12,
  },
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionText: {
    color: '#7f7fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  mapPreview: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 15,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    marginLeft: 10,
    fontSize: 18,
    color: '#FFD36F',
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 100,
  },
  infoContainer: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  priceText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFD36F',
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 30,
  },
  participateButton: {
    backgroundColor: '#7f7fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  participateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backToDiscoverButton: {
    backgroundColor: '#7f7fff',
    borderRadius: 10,
    padding: 15,
  },
  backToDiscoverText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 