import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function SettingsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#18171c',
        },
      }}
    >
      <Stack.Screen
        name="account"
        options={{
          title: 'Paramètres du compte',
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: 'Paiement',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
    </Stack>
  );
} 