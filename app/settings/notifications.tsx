import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [eventReminders, setEventReminders] = useState(true);
  const [newEventAlerts, setNewEventAlerts] = useState(true);
  const [socialNotifications, setSocialNotifications] = useState(false);

  const navigateBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Notifications Push */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionSubTitle, { color: colors.text }]}>Notifications Push</Text>
          
          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>Notifications générales</Text>
              <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                Recevez les notifications importantes de l'application
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>Rappels d'événements</Text>
              <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                Soyez notifié avant le début de vos événements favoris
              </Text>
            </View>
            <Switch
              value={eventReminders}
              onValueChange={setEventReminders}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={eventReminders ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>Nouveaux événements</Text>
              <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                Découvrez les nouveaux événements dans vos catégories préférées
              </Text>
            </View>
            <Switch
              value={newEventAlerts}
              onValueChange={setNewEventAlerts}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={newEventAlerts ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Notifications Email */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionSubTitle, { color: colors.text }]}>Notifications Email</Text>
          
          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>Résumé hebdomadaire</Text>
              <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                Recevez un résumé des événements de la semaine par email
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Notifications Sociales */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionSubTitle, { color: colors.text }]}>Notifications Sociales</Text>
          
          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>Activité sociale</Text>
              <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                Notifications quand vos amis participent à des événements
              </Text>
            </View>
            <Switch
              value={socialNotifications}
              onValueChange={setSocialNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={socialNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
          Vous pouvez modifier ces paramètres à tout moment. 
          Certaines notifications importantes ne peuvent pas être désactivées.
        </Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  notificationInfo: {
    flexDirection: 'column',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  notificationDescription: {
    fontSize: 14,
    maxWidth: '85%',
  },
  divider: {
    height: 1,
  },
  disclaimer: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
}); 