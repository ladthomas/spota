import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function PaymentScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('visa');

  const navigateBack = () => {
    router.back();
  };

  const navigateToAddPaymentMethod = () => {
    // Future implementation
    console.log('Naviguer vers ajouter une méthode de paiement');
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
        {/* Payment Methods */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Méthodes de paiement</Text>
          
          <TouchableOpacity style={styles.paymentMethod} onPress={() => setDefaultPaymentMethod('visa')}>
            <View style={styles.paymentMethodInfo}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="credit-card" size={24} color="#fff" />
              </View>
              <View>
                <Text style={[styles.paymentMethodTitle, { color: colors.text }]}>Visa •••• 4242</Text>
                <Text style={[styles.paymentMethodDescription, { color: colors.textSecondary }]}>Expire 12/24</Text>
              </View>
            </View>
            {defaultPaymentMethod === 'visa' && (
              <View style={styles.defaultBadge}>
                <Text style={[styles.defaultBadgeText, { color: colors.text }]}>Par défaut</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.paymentMethod} onPress={() => setDefaultPaymentMethod('mastercard')}>
            <View style={styles.paymentMethodInfo}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="credit-card" size={24} color="#fff" />
              </View>
              <View>
                <Text style={[styles.paymentMethodTitle, { color: colors.text }]}>Mastercard •••• 5678</Text>
                <Text style={[styles.paymentMethodDescription, { color: colors.textSecondary }]}>Expire 08/25</Text>
              </View>
            </View>
            {defaultPaymentMethod === 'mastercard' && (
              <View style={styles.defaultBadge}>
                <Text style={[styles.defaultBadgeText, { color: colors.text }]}>Par défaut</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.addPaymentButton}
            onPress={navigateToAddPaymentMethod}
          >
            <Text style={[styles.addPaymentButtonText, { color: colors.text }]}>+ Ajouter une méthode de paiement</Text>
          </TouchableOpacity>
        </View>

        {/* Billing Address */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Adresse de facturation</Text>
          
          <View style={[styles.addressInfo, { borderColor: colors.border }]}>
            <Text style={[styles.addressName, { color: colors.text }]}>Thomas Ladouyou</Text>
            <Text style={[styles.addressLine, { color: colors.textSecondary }]}>123 Rue de Paris</Text>
            <Text style={[styles.addressLine, { color: colors.textSecondary }]}>75001 Paris, France</Text>
          </View>

          <TouchableOpacity style={[styles.editButton, { borderColor: colors.border }]}>
            <Text style={[styles.editButtonText, { color: colors.text }]}>Modifier l'adresse</Text>
          </TouchableOpacity>
        </View>

        {/* Payment History */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Historique des paiements</Text>
          
          <View style={[styles.paymentHistoryItem, { borderColor: colors.border }]}>
            <View>
              <Text style={[styles.paymentHistoryTitle, { color: colors.text }]}>Événement: Concert Jazz</Text>
              <Text style={[styles.paymentHistoryDate, { color: colors.textSecondary }]}>24 juin 2023</Text>
            </View>
            <Text style={styles.paymentHistoryAmount}>35,00 €</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={[styles.paymentHistoryItem, { borderColor: colors.border }]}>
            <View>
              <Text style={[styles.paymentHistoryTitle, { color: colors.text }]}>Événement: Exposition d'art</Text>
              <Text style={[styles.paymentHistoryDate, { color: colors.textSecondary }]}>10 mai 2023</Text>
            </View>
            <Text style={styles.paymentHistoryAmount}>15,50 €</Text>
          </View>

          <TouchableOpacity style={[styles.viewAllButton, { borderColor: colors.border }]}>
            <Text style={[styles.viewAllButtonText, { color: colors.text }]}>Voir tout l'historique</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#26252e',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3c3b43',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  defaultBadge: {
    backgroundColor: '#6c58f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 10,
  },
  addPaymentButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addPaymentButtonText: {
    color: '#6c58f5',
    fontSize: 16,
    fontWeight: '500',
  },
  addressInfo: {
    marginBottom: 15,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  addressLine: {
    fontSize: 15,
    color: '#9e9e9e',
    lineHeight: 22,
  },
  editButton: {
    marginTop: 10,
  },
  editButtonText: {
    color: '#6c58f5',
    fontSize: 16,
    fontWeight: '500',
  },
  paymentHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentHistoryTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentHistoryDate: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  paymentHistoryAmount: {
    color: '#9e9e9e',
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: '#6c58f5',
    fontSize: 16,
    fontWeight: '500',
  },
}); 