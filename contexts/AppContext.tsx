import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import parisEventsService, { SimpleEvent } from '../services/parisEventsService';

// Types
type Evenement = {
  id: string;
  titre: string;
  lieu: string;
  date: string;
  prix: string;
  categorie?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  image?: string;
};

type AppContextType = {
  evenements: Evenement[];
  favoris: string[];
  loading: boolean;
  error: string | null;
  ajouterFavori: (id: string) => void;
  retirerFavori: (id: string) => void;
  ajouterEvenement: (evenement: Evenement) => void;
  rechercherEvenements: (query: string) => Promise<Evenement[]>;
  obtenirEvenementsGratuits: () => Promise<Evenement[]>;
  rafraichirEvenements: () => Promise<void>;
};

// Données de fallback en cas d'erreur API
const evenementsFallback: Evenement[] = [
  {
    id: 'fallback-1',
    titre: 'Événements parisiens en cours de chargement',
    lieu: 'Paris',
    date: 'Chargement...',
    prix: 'Variable',
    categorie: 'Culture',
    latitude: 48.8566,
    longitude: 2.3522,
    description: 'Les événements sont en cours de chargement depuis l\'API officielle de Paris.'
  }
];

// Création du contexte
const AppContext = createContext<AppContextType | null>(null);

// Hook pour utiliser le contexte
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext doit être utilisé à l'intérieur d'un AppProvider");
  }
  return context;
};

// Fonction pour convertir SimpleEvent vers Evenement
const convertirEvenement = (event: SimpleEvent): Evenement => ({
  id: event.id,
  titre: event.titre,
  lieu: event.lieu,
  date: event.date,
  prix: event.prix,
  categorie: event.categorie,
  latitude: event.latitude,
  longitude: event.longitude,
  description: event.description,
  image: event.image
});

// Provider du contexte
export function AppProvider({ children }: { children: ReactNode }) {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [favoris, setFavoris] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les événements depuis l'API Paris au démarrage
  const chargerEvenements = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Chargement des événements depuis l\'API Paris...');
      
      const eventsFromAPI = await parisEventsService.getEvents({ limit: 50 });
      const evenementsConverts = eventsFromAPI.map(convertirEvenement);
      
      if (evenementsConverts.length > 0) {
        setEvenements(evenementsConverts);
        console.log(`✅ ${evenementsConverts.length} événements chargés avec succès`);
      } else {
        console.log('⚠️ Aucun événement récupéré, utilisation des données de fallback');
        setEvenements(evenementsFallback);
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement des événements:', err);
      setError('Impossible de charger les événements parisiens');
      setEvenements(evenementsFallback);
    } finally {
      setLoading(false);
    }
  };

  // Charger les événements au démarrage
  useEffect(() => {
    chargerEvenements();
  }, []);

  const ajouterFavori = (id: string) => {
    setFavoris(prevFavoris => {
      if (!prevFavoris.includes(id)) {
        const nouveauxFavoris = [...prevFavoris, id];
        console.log(`💖 Favori ajouté: ${id}`);
        return nouveauxFavoris;
      }
      return prevFavoris;
    });
  };

  const retirerFavori = (id: string) => {
    setFavoris(prevFavoris => {
      const nouveauxFavoris = prevFavoris.filter(favId => favId !== id);
      console.log(`💔 Favori retiré: ${id}`);
      return nouveauxFavoris;
    });
  };

  const ajouterEvenement = (evenement: Evenement) => {
    setEvenements(prevEvenements => {
      const nouveauxEvenements = [...prevEvenements, evenement];
      console.log(`➕ Événement ajouté: ${evenement.titre}`);
      return nouveauxEvenements;
    });
  };

  const rechercherEvenements = async (query: string): Promise<Evenement[]> => {
    try {
      console.log(`🔍 Recherche d'événements: "${query}"`);
      const resultats = await parisEventsService.searchEvents(query);
      return resultats.map(convertirEvenement);
    } catch (err) {
      console.error('❌ Erreur lors de la recherche:', err);
      return [];
    }
  };

  const obtenirEvenementsGratuits = async (): Promise<Evenement[]> => {
    try {
      console.log('💰 Récupération des événements gratuits...');
      const evenementsGratuits = await parisEventsService.getFreeEvents();
      return evenementsGratuits.map(convertirEvenement);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des événements gratuits:', err);
      return [];
    }
  };

  const rafraichirEvenements = async (): Promise<void> => {
    await chargerEvenements();
  };



  const value = {
    evenements,
    favoris,
    loading,
    error,
    ajouterFavori,
    retirerFavori,
    ajouterEvenement,
    rechercherEvenements,
    obtenirEvenementsGratuits,
    rafraichirEvenements,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
} 