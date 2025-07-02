// Utilitaires pour le nettoyage et formatage de texte

/**
 * Nettoie le texte HTML en supprimant les balises et en décodant les entités
 * @param text - Le texte HTML à nettoyer
 * @returns Le texte nettoyé sans HTML
 */
export function cleanHtmlText(text?: string | null): string {
  if (!text || text === 'null') return '';
  
  return text
    // Remplacer les balises <br> par des espaces AVANT de supprimer toutes les balises
    .replace(/<br\s*\/?>/gi, ' ')
    // Remplacer les balises de fin de paragraphe par des espaces
    .replace(/<\/p>/gi, ' ')
    // Supprimer toutes les autres balises HTML
    .replace(/<[^>]*>/g, '')
    // Nettoyer les entités HTML courantes
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

/**
 * Truncate le texte à une longueur donnée en gardant les mots complets
 * @param text - Le texte à tronquer
 * @param maxLength - Longueur maximum
 * @returns Le texte tronqué
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Capitalise la première lettre d'une chaîne
 * @param text - Le texte à capitaliser
 * @returns Le texte avec la première lettre en majuscule
 */
export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Nettoie et formate un prix qui peut contenir du HTML
 * @param priceText - Le texte de prix qui peut contenir du HTML
 * @returns Le prix nettoyé et formaté
 */
export function cleanAndFormatPrice(priceText?: string | null): string {
  if (!priceText || priceText === 'null') return 'Prix à confirmer';
  
  // Nettoyer le HTML d'abord
  const cleaned = cleanHtmlText(priceText);
  
  // Si c'est déjà formaté, le retourner
  if (cleaned.includes('€') || cleaned.toLowerCase().includes('gratuit') || cleaned.toLowerCase().includes('payant')) {
    return cleaned;
  }
  
  // Essayer de parser comme nombre
  const numPrice = parseFloat(cleaned);
  if (!isNaN(numPrice)) {
    return `${numPrice.toFixed(2).replace('.', ',')} €`;
  }
  
  return cleaned || 'Prix à confirmer';
}

/**
 * Formate un prix en euros
 * @param price - Le prix à formater
 * @returns Le prix formaté
 */
export function formatPrice(price: number | string): string {
  if (typeof price === 'string') {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `${numPrice.toFixed(2).replace('.', ',')} €`;
  }
  
  return `${price.toFixed(2).replace('.', ',')} €`;
}

/**
 * Débogue l'affichage de texte HTML (utile pour le développement)
 * @param originalText - Le texte original
 * @param cleanedText - Le texte nettoyé  
 */
export function debugHtmlText(originalText: string, cleanedText: string): void {
  if (__DEV__) {
    console.log('🔍 Debug HTML Text:');
    console.log('Original:', originalText);
    console.log('Cleaned:', cleanedText);
    console.log('Has HTML:', /<[^>]*>/.test(originalText));
    console.log('---');
  }
} 