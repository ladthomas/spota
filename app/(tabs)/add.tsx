import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';

export default function AddScreen() {
  const [titre, setTitre] = useState('');
  const [lieu, setLieu] = useState('');
  const [date, setDate] = useState('');
  const [prix, setPrix] = useState('');
  const [categorie, setCategorie] = useState('');
  
  const { ajouterEvenement } = useAppContext();

  const handleSubmit = () => {
    // Validation de base
    if (!titre || !lieu || !date || !prix || !categorie) {
      Alert.alert('Information manquante', 'Merci de remplir tous les champs');
      return;
    }
    
    // Ajout de l'événement au contexte global
    const nouvelEvenement = {
      id: Date.now().toString(), // ID unique basé sur le timestamp
      titre,
      lieu,
      date,
      prix,
      categorie,
      // On pourrait ajouter les coordonnées géographiques ici avec l'API de géocodage
    };
    
    ajouterEvenement(nouvelEvenement);
    
    // Confirmation et reset du formulaire
    Alert.alert('Merci !', 'Ta sortie a été proposée à la communauté 🎉');
    setTitre('');
    setLieu('');
    setDate('');
    setPrix('');
    setCategorie('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Proposer une sortie</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre de la sortie"
        placeholderTextColor="#aaa"
        value={titre}
        onChangeText={setTitre}
      />
      <TextInput
        style={styles.input}
        placeholder="Lieu"
        placeholderTextColor="#aaa"
        value={lieu}
        onChangeText={setLieu}
      />
      <TextInput
        style={styles.input}
        placeholder="Date et heure"
        placeholderTextColor="#aaa"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix (ex: Gratuit, <5€)"
        placeholderTextColor="#aaa"
        value={prix}
        onChangeText={setPrix}
      />
      <TextInput
        style={styles.input}
        placeholder="Catégorie (Musique, Art, Découverte, etc.)"
        placeholderTextColor="#aaa"
        value={categorie}
        onChangeText={setCategorie}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Proposer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171c',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#23202a',
    color: '#fff',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FFD36F',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: '#18171c',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 