// Service pour récupérer les événements parisiens depuis l'API officielle v2.1
// API v2.1 officielle : https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records
const PARIS_API_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records';

export interface ParisEvent {
  id: string;
  event_id: number;
  url: string;
  title: string;
  lead_text: string;
  description: string;
  date_start: string | null;
  date_end: string | null;
  date_description: string | null;
  occurrences: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  cover_credit: string | null;
  locations: Array<{
    accessibility: {
      blind: boolean | null;
      pmr: boolean | null;
      deaf: boolean | null;
      sign_language: boolean | null;
      mental: boolean | null;
    };
    address_street: string;
    address_zipCode: string;
    address_details: string;
    address_name: string;
    address_lat_lon: string;
    location_type: string;
    address_city: string;
  }>;
  address_name: string;
  address_street: string;
  address_zipcode: string;
  address_city: string;
  lat_lon: {
    lon: number;
    lat: number;
  };
  pmr: boolean | null;
  blind: boolean | null;
  deaf: boolean | null;
  sign_language: boolean | null;
  mental: boolean | null;
  transport: string | null;
  contact_url: string | null;
  contact_phone: string | null;
  contact_mail: string | null;
  contact_facebook: string | null;
  contact_twitter: string | null;
  price_type: string;
  price_detail: string | null;
  access_type: string;
  access_link: string | null;
  access_link_text: string | null;
  updated_at: string;
  programs: string | null;
  audience: string | null;
  qfap_tags: string | null;
  universe_tags: string | null;
  event_indoor: number;
  event_pets_allowed: number;
  contact_organisation_name: string | null;
  locale: string;
  rank: number;
  weight: number;
}

// Interface simplifiée pour l'affichage dans l'app
export interface SimpleEvent {
  id: string;
  titre: string;
  lieu: string;
  date: string;
  prix: string;
  categorie: string;
  latitude: number;
  longitude: number;
  description: string;
  image?: string;
}

class ParisEventsService {
  // Récupérer les événements parisiens
  async getEvents(options: {
    limit?: number;
    category?: string;
    city?: string;
    freeOnly?: boolean;
  } = {}): Promise<SimpleEvent[]> {
    try {
      const params = new URLSearchParams({
        limit: String(options.limit || 50),
      });

      // Filtrer par événements gratuits
      if (options.freeOnly) {
        params.append('where', 'price_type="gratuit"');
      }

      console.log('🌐 Récupération événements Paris depuis API v2.1...');
      
      const response = await fetch(`${PARIS_API_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur API Paris: ${response.status}`);
      }

      const data = await response.json();
      
      // Vérifier la structure de la réponse
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Structure de réponse API inattendue');
      }

      // Transformer les données de l'API Paris vers notre format simplifié
      const events: SimpleEvent[] = data.results.map((event: ParisEvent, index: number) => {
        return {
          id: event.id || `paris-${index}`,
          titre: this.cleanHtmlText(event.title) || 'Événement parisien',
          lieu: this.cleanHtmlText(event.address_name) || this.cleanHtmlText(event.address_street) || 'Paris',
          date: this.formatDate(event.date_start, event.date_description, event.occurrences),
          prix: this.formatPrice(event.price_type, event.price_detail),
          categorie: this.getCategory(event.qfap_tags),
          latitude: event.lat_lon?.lat || 48.8566,
          longitude: event.lat_lon?.lon || 2.3522,
          description: this.cleanDescription(event.description) || this.cleanHtmlText(event.lead_text) || 'Découvrez cet événement parisien',
          image: event.cover_url || `https://picsum.photos/300/200?random=${index}`
        };
      });

      console.log(` ${events.length} événements récupérés depuis l'API Paris`);
      return events;
      
    } catch (error) {
      console.error(' Erreur récupération événements Paris:', error);
      
      // Retourner des données de fallback en cas d'erreur
      return this.getFallbackEvents();
    }
  }

  // Formatter la date avec gestion des différents formats
  private formatDate(dateStart?: string | null, dateDescription?: string | null, occurrences?: string | null): string {
    // Si on a une description de date, l'utiliser
    if (dateDescription && dateDescription !== 'null') {
      return dateDescription;
    }

    // Si on a des occurrences, les utiliser
    if (occurrences && occurrences !== 'null') {
      return 'Plusieurs dates disponibles';
    }

    // Sinon essayer de formater la date de début
    if (!dateStart) return 'Date à confirmer';
    
    try {
      const date = new Date(dateStart);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Aujourd\'hui';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Demain';
      } else {
        return date.toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
      }
    } catch {
      return 'Date à confirmer';
    }
  }

  // Formatter le prix
  private formatPrice(priceType?: string, priceDetail?: string | null): string {
    if (priceType === 'gratuit') {
      return 'Gratuit';
    }
    
    if (priceDetail && priceDetail !== 'null') {
      // Nettoyer le HTML du prix détaillé
      const cleanPrice = this.cleanHtmlText(priceDetail);
      return cleanPrice || 'Prix à confirmer';
    }
    
    if (priceType === 'payant') {
      return 'Payant';
    }
    
    return 'Prix à confirmer';
  }

  // Nettoyer le texte HTML (descriptions, prix, etc.)
  private cleanHtmlText(text?: string | null): string {
    if (!text || text === 'null') return '';
    
    // Supprimer les balises HTML et nettoyer les entités
    return text
      // Remplacer les balises <br> par des espaces AVANT de supprimer toutes les balises
      .replace(/<br\s*\/?>/gi, ' ')
      // Remplacer les balises de fin de paragraphe par des espaces
      .replace(/<\/p>/gi, ' ')
      // Supprimer toutes les autres balises HTML
      .replace(/<[^>]*>/g, '')
      // Nettoyer les entités HTML
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&hellip;/g, '...')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&eacute;/g, 'é')
      .replace(/&egrave;/g, 'è')
      .replace(/&agrave;/g, 'à')
      .replace(/&ccedil;/g, 'ç')
      .replace(/&ocirc;/g, 'ô')
      .replace(/&ecirc;/g, 'ê')
      .replace(/&acirc;/g, 'â')
      .replace(/&ucirc;/g, 'û')
      // Supprimer les espaces multiples
      .replace(/\s+/g, ' ')
      // Nettoyer les sauts de ligne multiples
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  // Fonction spécifique pour nettoyer les descriptions (garde la fonction pour compatibilité)
  private cleanDescription(description?: string): string {
    const cleaned = this.cleanHtmlText(description);
    
    // Améliorer la mise en forme pour les descriptions longues
    return cleaned
      // Ajouter des espaces après les points pour améliorer la lisibilité
      .replace(/\.([A-Z])/g, '. $1')
      // Ajouter des espaces après les points-virgules
      .replace(/;([a-zA-Z])/g, '; $1')
      // Corriger les espaces multiples qui pourraient apparaître
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Déterminer la catégorie à partir des tags
  private getCategory(tags?: string | null): string {
    if (!tags || tags === 'null') return 'Culture';
    
    const tagsLower = tags.toLowerCase();
    
    const categoryMap: { [key: string]: string } = {
      'photo': 'Art',
      'expo': 'Art',
      'exposition': 'Art',
      'art': 'Art',
      'théâtre': 'Art',
      'danse': 'Art',
      'concert': 'Musique',
      'musique': 'Musique',
      'sport': 'Sport',
      'cinema': 'Culture',
      'conférence': 'Culture',
      'enfants': 'Famille',
      'famille': 'Famille',
      'nature': 'Nature',
      'ballade': 'Nature',
      'visite': 'Culture'
    };

    // Chercher la première catégorie reconnue
    for (const [key, category] of Object.entries(categoryMap)) {
      if (tagsLower.includes(key)) {
        return category;
      }
    }
    
    return 'Culture';
  }



  // Événements de fallback en cas d'erreur API
  private getFallbackEvents(): SimpleEvent[] {
    return [
      {
        id: 'fallback-1',
        titre: 'Événements parisiens en cours de chargement',
        lieu: 'Paris',
        date: 'Chargement...',
        prix: 'Variable',
        categorie: 'Culture',
        latitude: 48.8566,
        longitude: 2.3522,
        description: 'Les événements sont en cours de chargement depuis l\'API officielle de Paris. Veuillez patienter...'
      }
    ];
  }

  // Rechercher des événements par mot-clé
  async searchEvents(query: string): Promise<SimpleEvent[]> {
    try {
      const params = new URLSearchParams({
        limit: '20',
        search: query
      });

      const response = await fetch(`${PARIS_API_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur recherche: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results.map((event: ParisEvent, index: number) => {
        return {
          id: event.id || `search-${index}`,
          titre: this.cleanHtmlText(event.title) || 'Résultat de recherche',
          lieu: this.cleanHtmlText(event.address_name) || 'Paris',
          date: this.formatDate(event.date_start, event.date_description, event.occurrences),
          prix: this.formatPrice(event.price_type, event.price_detail),
          categorie: this.getCategory(event.qfap_tags),
          latitude: event.lat_lon?.lat || 48.8566,
          longitude: event.lat_lon?.lon || 2.3522,
          description: this.cleanDescription(event.description) || this.cleanHtmlText(event.lead_text) || 'Résultat de recherche',
          image: event.cover_url || `https://picsum.photos/300/200?random=${index}`
        };
      });
      
    } catch (error) {
      console.error(' Erreur recherche événements:', error);
      return [];
    }
  }

  // Récupérer les événements par catégorie
  async getEventsByCategory(category: string): Promise<SimpleEvent[]> {
    try {
      const params = new URLSearchParams({
        limit: '30',
        where: `qfap_tags LIKE "%${category}%"`
      });

      const response = await fetch(`${PARIS_API_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur catégorie: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results.map((event: ParisEvent, index: number) => {
        return {
          id: event.id || `cat-${index}`,
          titre: this.cleanHtmlText(event.title) || 'Événement parisien',
          lieu: this.cleanHtmlText(event.address_name) || 'Paris',
          date: this.formatDate(event.date_start, event.date_description, event.occurrences),
          prix: this.formatPrice(event.price_type, event.price_detail),
          categorie: this.getCategory(event.qfap_tags),
          latitude: event.lat_lon?.lat || 48.8566,
          longitude: event.lat_lon?.lon || 2.3522,
          description: this.cleanDescription(event.description) || this.cleanHtmlText(event.lead_text) || 'Découvrez cet événement parisien',
          image: event.cover_url || `https://picsum.photos/300/200?random=${index}`
        };
      });
      
    } catch (error) {
      console.error(' Erreur événements par catégorie:', error);
      return [];
    }
  }

  // Récupérer les événements gratuits
  async getFreeEvents(): Promise<SimpleEvent[]> {
    return this.getEvents({ freeOnly: true, limit: 30 });
  }
}

export default new ParisEventsService(); 