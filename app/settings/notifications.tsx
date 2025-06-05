import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [eventUpdatesEnabled, setEventUpdatesEnabled] = useState(true);
  const [discoverSuggestionsEnabled, setDiscoverSuggestionsEnabled] = useState(true);
  const [messageNotificationsEnabled, setMessageNotificationsEnabled] = useState(true);
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(false);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);

  const navigateBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications push</Text>
          
          <View style={styles.setting}>
            <View>
              <Text style={styles.settingTitle}>Toutes les notifications</Text>
              <Text style={styles.settingDescription}>Activer/désactiver toutes les notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#3e3e3e', true: '#6c58f5' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.setting}>
            <View>
              <Text style={styles.settingTitle}>Mises à jour d'événements</Text>
              <Text style={styles.settingDescription}>Changements de lieu, date ou annulations</Text>
            </View>
            <Switch
              value={eventUpdatesEnabled}
              onValueChange={setEventUpdatesEnabled}
              trackColor={{ false: '#3e3e3e', true: '#6c58f5' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.setting}>
            <View>
              <Text style={styles.settingTitle}>Suggestions Découvrir</Text>
              <Text style={styles.settingDescription}>Nouvelles expériences qui pourraient vous intéresser</Text>
            </View>
            <Switch
              value={discoverSuggestionsEnabled}
              onValueChange={setDiscoverSuggestionsEnabled}
              trackColor={{ false: '#3e3e3e', true: '#6c58f5' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.setting}>
            <View>
              <Text style={styles.settingTitle}>Messages</Text>
              <Text style={styles.settingDescription}>Nouveaux messages des créateurs d'événements</Text>
            </View>
            <Switch
              value={messageNotificationsEnabled}
              onValueChange={setMessageNotificationsEnabled}
              trackColor={{ false: '#3e3e3e', true: '#6c58f5' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.setting}>
            <View>
              <Text style={styles.settingTitle}>Annonces Spota</Text>
              <Text style={styles.settingDescription}>Actualités, fonctionnalités et mises à jour</Text>
            </View>
            <Switch
              value={announcementsEnabled}
              onValueChange={setAnnouncementsEnabled}
              trackColor={{ false: '#3e3e3e', true: '#6c58f5' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Email Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications par email</Text>
          
          <View style={styles.setting}>
            <View>
              <Text style={styles.settingTitle}>Résumé hebdomadaire</Text>
              <Text style={styles.settingDescription}>Événements et activités à venir</Text>
            </View>
            <Switch
              value={emailDigestEnabled}
              onValueChange={setEmailDigestEnabled}
              trackColor={{ false: '#3e3e3e', true: '#6c58f5' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#18171c',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#26252e',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#9e9e9e',
    maxWidth: '85%',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
  },
}); 