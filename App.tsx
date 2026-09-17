import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';

// AudioService is now initialized lazily inside useAudioEngine hook
// instead of on app startup — avoids crashes when audio files are missing

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}