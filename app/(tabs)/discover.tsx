import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function DiscussionScreen() {
  const [searchText, setSearchText] = useState('');
  const { theme, colors } = useTheme();

  const handleStartChat = () => {
    // Navigation vers l'écran de chat
    console.log('Démarrer le chat');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header avec avatar et titre */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.avatar}>
          {/*  <Text style={styles.avatarEmoji}>😊</Text>  a supprime */}
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Discussion</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Rechercher des conversations..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Zone centrale avec illustration */}
      <View style={styles.centerContent}>
        {/* Illustration de conversation */}
        <View style={styles.illustrationContainer}>
          <View style={styles.chatBubbleContainer}>
            {/* Avatars des participants */}
            <View style={styles.participantsContainer}>
              <View style={[styles.participantAvatar, styles.avatar1]}>
                <Text style={styles.participantEmoji}>👩‍🦳</Text>
              </View>
              <View style={[styles.participantAvatar, styles.avatar2]}>
                <Text style={styles.participantEmoji}>👨‍🦱</Text>
              </View>
              <View style={[styles.participantAvatar, styles.avatar3]}>
                <Text style={styles.participantEmoji}>👩‍🦰</Text>
              </View>
              <View style={[styles.participantAvatar, styles.avatar4]}>
                <Text style={styles.participantEmoji}>👨‍🦲</Text>
              </View>
            </View>
            
            {/* Bulle de chat */}
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>Tu sors ? Spote-le</Text>
            </View>
          </View>
          
          {/* Microphone flottant 
          <View style={styles.microphoneContainer}>
            <View style={styles.microphoneButton}>
              <Ionicons name="mic" size={20} color="#fff" />
            </View>
          </View>*/}
        </View> 

        {/* Textes informatifs */}
        <Text style={[styles.mainText, { color: colors.text }]}>C'est calme ici</Text>
        <Text style={[styles.subText, { color: colors.textSecondary }]}>
          Commencez une discussion avec vos amis ou d'autres personnes lors de votre événement.
        </Text>

        {/* Bouton Démarrer le chat */}
        <TouchableOpacity style={styles.startChatButton} onPress={handleStartChat}>
          <Text style={styles.startChatText}>Démarrer le chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 40,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  chatBubbleContainer: {
    alignItems: 'center',
  },
  participantsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
    position: 'relative',
    width: 200,
    height: 60,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatar1: {
    backgroundColor: '#FFB6C1',
    left: 0,
    top: 0,
  },
  avatar2: {
    backgroundColor: '#DDA0DD',
    left: 30,
    top: -10,
  },
  avatar3: {
    backgroundColor: '#98FB98',
    right: 30,
    top: -10,
  },
  avatar4: {
    backgroundColor: '#F0E68C',
    right: 0,
    top: 0,
  },
  participantEmoji: {
    fontSize: 18,
  },
  chatBubble: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: width - 80,
    position: 'relative',
  },
  chatText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  microphoneContainer: {
    position: 'absolute',
    bottom: -60,
    right: -20,
  },
  microphoneButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  startChatButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startChatText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
}); 