const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Expo Go compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config; 