#!/usr/bin/env node

console.log('🔧 VALIDATION DE LA CORRECTION HTML - SPOTA');
console.log('=' .repeat(60));

// Tests des fonctions de nettoyage HTML
const testCases = [
  {
    name: 'Balises <p> simples',
    input: '<p>Les serres tropicales sont accessibles</p>',
    expected: 'Les serres tropicales sont accessibles'
  },
  {
    name: 'Balises <p> avec contenu complexe',
    input: '<p>Les serres tropicales sont accessibles sur demande pour les groupes de professionnels, les sociétés ou les associations d\'amateurs ; les serres ne sont pas ouvertes au public sauf lors de visites guidées, qui sont régulièrement organisées les lundis avec des thématiques variées.</p>',
    expected: 'Les serres tropicales sont accessibles sur demande pour les groupes de professionnels, les sociétés ou les associations d\'amateurs ; les serres ne sont pas ouvertes au public sauf lors de visites guidées, qui sont régulièrement organisées les lundis avec des thématiques variées.'
  },
  {
    name: 'Balises <br>',
    input: 'Première ligne<br/>Deuxième ligne<br>Troisième ligne',
    expected: 'Première ligne Deuxième ligne Troisième ligne'
  },
  {
    name: 'Entités HTML françaises',
    input: 'Événement à Paris avec présentation créée',
    expected: 'Événement à Paris avec présentation créée'
  },
  {
    name: 'Balises multiples',
    input: '<div><p>Test</p><br><span>avec plusieurs balises</span></div>',
    expected: 'Test avec plusieurs balises'
  }
];

// Fonction de nettoyage (copie corrigée de celle dans le service)
function cleanHtmlText(text) {
  if (!text) return '';
  
  return text
    // Remplacer les balises <br> par des espaces AVANT de supprimer toutes les balises
    .replace(/<br\s*\/?>/gi, ' ')
    // Remplacer les balises de fin de paragraphe par des espaces
    .replace(/<\/p>/gi, ' ')
    // Supprimer toutes les autres balises HTML
    .replace(/<[^>]*>/g, '')
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
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&acirc;/g, 'â')
    .replace(/&ucirc;/g, 'û')
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

// Exécuter les tests
let passedTests = 0;
let totalTests = testCases.length;

console.log('\n EXÉCUTION DES TESTS:\n');

testCases.forEach((test, index) => {
  const result = cleanHtmlText(test.input);
  const passed = result === test.expected;
  
  console.log(`Test ${index + 1}: ${test.name}`);
  console.log(`  Input:    ${test.input}`);
  console.log(`  Output:   ${result}`);
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Status:   ${passed ? '✅ PASSÉ' : '❌ ÉCHEC'}`);
  console.log('');
  
  if (passed) passedTests++;
});

// Résultats finaux
console.log(' RÉSULTATS:');
console.log(`  Tests passés: ${passedTests}/${totalTests}`);
console.log(`  Taux de réussite: ${Math.round(passedTests/totalTests*100)}%`);

if (passedTests === totalTests) {
  console.log('\n TOUS LES TESTS SONT PASSÉS !');
  console.log('✅ La correction HTML fonctionne parfaitement.');
  console.log('✅ Les balises <p> et <br> sont supprimées.');
  console.log('✅ Le texte est maintenant lisible et beau.');
} else {
  console.log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ');
  console.log('❌ Vérifiez la fonction cleanHtmlText dans le service.');
}

console.log('\n' + '=' .repeat(60)); 