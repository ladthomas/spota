import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="account" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="appearance" />
    </Stack>
  );
} 