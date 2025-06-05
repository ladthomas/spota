import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('visa');

  const navigateBack = () => {
    router.back();
  };

  const navigateToAddPaymentMethod = () => {
    // Future implementation
    console.log('Naviguer vers ajouter une méthode de paiement');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthodes de paiement</Text>
          
          <TouchableOpacity style={styles.paymentMethod} onPress={() => setDefaultPaymentMethod('visa')}>
            <View style={styles.paymentMethodInfo}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="credit-card" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.paymentMethodTitle}>Visa •••• 4242</Text>
                <Text style={styles.paymentMethodDescription}>Expire 12/24</Text>
              </View>
            </View>
            {defaultPaymentMethod === 'visa' && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Par défaut</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.paymentMethod} onPress={() => setDefaultPaymentMethod('mastercard')}>
            <View style={styles.paymentMethodInfo}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="credit-card" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.paymentMethodTitle}>Mastercard •••• 5678</Text>
                <Text style={styles.paymentMethodDescription}>Expire 08/25</Text>
              </View>
            </View>
            {defaultPaymentMethod === 'mastercard' && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Par défaut</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.addPaymentButton}
            onPress={navigateToAddPaymentMethod}
          >
            <Text style={styles.addPaymentButtonText}>+ Ajouter une méthode de paiement</Text>
          </TouchableOpacity>
        </View>

        {/* Billing Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse de facturation</Text>
          
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>Thomas Ladouy</Text>
            <Text style={styles.addressLine}>123 Rue de Paris</Text>
            <Text style={styles.addressLine}>75001 Paris, France</Text>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Modifier l'adresse</Text>
          </TouchableOpacity>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique des paiements</Text>
          
          <View style={styles.paymentHistoryItem}>
            <View>
              <Text style={styles.paymentHistoryTitle}>Événement: Concert Jazz</Text>
              <Text style={styles.paymentHistoryDate}>24 juin 2023</Text>
            </View>
            <Text style={styles.paymentHistoryAmount}>35,00 €</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.paymentHistoryItem}>
            <View>
              <Text style={styles.paymentHistoryTitle}>Événement: Exposition d'art</Text>
              <Text style={styles.paymentHistoryDate}>10 mai 2023</Text>
            </View>
            <Text style={styles.paymentHistoryAmount}>15,50 €</Text>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>Voir tout l'historique</Text>
          </TouchableOpacity>
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
    color: '#fff',
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
    color: '#fff',
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
    color: '#fff',
  },
  paymentHistoryDate: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  paymentHistoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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