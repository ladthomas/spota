import React, { createContext, ReactNode, useContext, useState } from 'react';

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
};

type AppContextType = {
  evenements: Evenement[];
  favoris: string[];
  ajouterFavori: (id: string) => void;
  retirerFavori: (id: string) => void;
  ajouterEvenement: (evenement: Evenement) => void;
};

// Données mock initiales
const evenementsInitiaux: Evenement[] = [
  {
    id: '1',
    titre: 'Concert gratuit au Parc',
    lieu: 'Parc Monceau',
    date: 'Ce soir, 19:00',
    prix: 'Gratuit',
    categorie: 'Musique',
    latitude: 48.882, 
    longitude: 2.308,
  },
  {
    id: '2',
    titre: 'Atelier Peinture',
    lieu: 'Maison des Arts',
    date: 'Demain, 15:00',
    prix: '< 5€',
    categorie: 'Art',
    latitude: 48.870, 
    longitude: 2.32,
  },
  {
    id: '3',
    titre: 'Balade guidée',
    lieu: 'Quais de Seine',
    date: 'Ce week-end',
    prix: 'Gratuit',
    categorie: 'Nature',
    latitude: 48.857, 
    longitude: 2.35,
  },
  {
    id: '4',
    titre: 'Match de foot amateur',
    lieu: 'Stade Charléty',
    date: 'Samedi, 14:00',
    prix: 'Gratuit',
    categorie: 'Sport',
    latitude: 48.818, 
    longitude: 2.346,
  },
  {
    id: '5',
    titre: 'Dégustation de fromages',
    lieu: 'Marché des Enfants Rouges',
    date: 'Dimanche, 11:00',
    prix: '< 10€',
    categorie: 'Food',
    latitude: 48.863, 
    longitude: 2.363,
  },
  {
    id: '6',
    titre: 'Meetup JavaScript',
    lieu: 'Station F',
    date: 'Jeudi, 18:30',
    prix: 'Gratuit',
    categorie: 'Tech',
    latitude: 48.832, 
    longitude: 2.372,
  },
  {
    id: '7',
    titre: 'Jazz Session',
    lieu: 'Le Sunset',
    date: 'Vendredi, 21:00',
    prix: '< 15€',
    categorie: 'Musique',
    latitude: 48.858, 
    longitude: 2.347,
  },
  {
    id: '8',
    titre: 'Exposition Photo',
    lieu: 'Galerie Perrotin',
    date: 'Tout le week-end',
    prix: 'Gratuit',
    categorie: 'Art',
    latitude: 48.860, 
    longitude: 2.327,
  },
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

// Provider du contexte
export function AppProvider({ children }: { children: ReactNode }) {
  const [evenements, setEvenements] = useState<Evenement[]>(evenementsInitiaux);
  const [favoris, setFavoris] = useState<string[]>([]);

  const ajouterFavori = (id: string) => {
    setFavoris(prevFavoris => [...prevFavoris, id]);
  };

  const retirerFavori = (id: string) => {
    setFavoris(prevFavoris => prevFavoris.filter(favId => favId !== id));
  };

  const ajouterEvenement = (evenement: Evenement) => {
    setEvenements(prevEvenements => [...prevEvenements, evenement]);
  };

  const value = {
    evenements,
    favoris,
    ajouterFavori,
    retirerFavori,
    ajouterEvenement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
} 