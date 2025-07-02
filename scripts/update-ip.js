#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Fonction pour obtenir l'IP locale
function getLocalIP() {
  return new Promise((resolve, reject) => {
    exec('ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1', (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      
      const match = stdout.match(/inet (\d+\.\d+\.\d+\.\d+)/);
      if (match) {
        resolve(match[1]);
      } else {
        reject(new Error('Impossible de détecter l\'IP locale'));
      }
    });
  });
}

// Fonction pour mettre à jour le fichier de configuration
async function updateConfigFile() {
  try {
    const localIP = await getLocalIP();
    const configPath = path.join(__dirname, '../services/config.ts');
    
    console.log(`🔍 IP locale détectée: ${localIP}`);
    
    // Lire le fichier actuel
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Remplacer l'IP dans le fichier
    const ipRegex = /const LOCAL_IP = '[0-9.]+'/;
    const newIPLine = `const LOCAL_IP = '${localIP}'`;
    
    if (configContent.match(ipRegex)) {
      configContent = configContent.replace(ipRegex, newIPLine);
      
      // Écrire le fichier mis à jour
      fs.writeFileSync(configPath, configContent);
      
      console.log(` Fichier de configuration mis à jour avec l'IP: ${localIP}`);
      console.log(` Fichier modifié: ${configPath}`);
      console.log(`\n Redémarrez votre application pour appliquer les changements.`);
    } else {
      console.log(' Impossible de trouver la ligne IP à remplacer dans le fichier de configuration');
    }
    
  } catch (error) {
    console.error(' Erreur lors de la mise à jour:', error.message);
  }
}


console.log(' Mise à jour automatique de l\'IP locale...');
updateConfigFile(); 