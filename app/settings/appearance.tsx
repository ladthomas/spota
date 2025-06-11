import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function AppearanceSettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();

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
        {/* Titre de la section principale */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Thème</Text>
        
        {/* Options de thème */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={styles.themeOption}
            onPress={() => theme !== 'dark' && toggleTheme()}
          >
            <View style={styles.themeOptionContent}>
              <View style={styles.themeIconContainer}>
                <Ionicons name="moon" size={24} color={colors.textSecondary} />
              </View>
              <View style={styles.themeTextContainer}>
                <Text style={[styles.themeTitle, { color: colors.text }]}>Mode sombre</Text>
                <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                  Interface sombre pour un confort visuel
                </Text>
              </View>
            </View>
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioButton, 
                { borderColor: colors.border },
                theme === 'dark' && { borderColor: colors.primary }
              ]}>
                {theme === 'dark' && (
                  <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity 
            style={styles.themeOption}
            onPress={() => theme !== 'light' && toggleTheme()}
          >
            <View style={styles.themeOptionContent}>
              <View style={styles.themeIconContainer}>
                <Ionicons name="sunny" size={24} color={colors.textSecondary} />
              </View>
              <View style={styles.themeTextContainer}>
                <Text style={[styles.themeTitle, { color: colors.text }]}>Mode clair</Text>
                <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                  Interface claire et lumineuse
                </Text>
              </View>
            </View>
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioButton, 
                { borderColor: colors.border },
                theme === 'light' && { borderColor: colors.primary }
              ]}>
                {theme === 'light' && (
                  <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section d'information */}
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Vous pouvez changer l'apparence de l'application en sélectionnant un thème. 
          Le thème choisi sera appliqué à toute l'application.
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  themeOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  themeTextContainer: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  themeDescription: {
    fontSize: 14,
  },
  radioContainer: {
    marginLeft: 15,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
    marginHorizontal: 8,
  },
}); 