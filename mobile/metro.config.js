const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Explicitly set unstable_conditionNames to exclude 'import', forcing resolution of standard CJS/JS files
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require', 'default'];

module.exports = config;
