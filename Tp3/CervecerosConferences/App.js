import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ConferenceListScreen from './src/screens/ConferenceListScreen';
import ConferenceDetailScreen from './src/screens/ConferenceDetailScreen';
import MapScreen from './src/screens/MapScreen';
import { initDatabase } from './src/utils/storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ConferenceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ConferenceList" 
        component={ConferenceListScreen}
        options={{ title: 'Conferencias Cerveceras' }}
      />
      <Stack.Screen 
        name="ConferenceDetail" 
        component={ConferenceDetailScreen}
        options={{ title: 'Detalle de Conferencia' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await initDatabase();
      setDbInitialized(true);
    };
    initializeApp();
  }, []);

  if (!dbInitialized) {
    return null; // O un componente de loading
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Conferencias') {
              iconName = focused ? 'beer' : 'beer-outline';
            } else if (route.name === 'Mapa') {
              iconName = focused ? 'map' : 'map-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Conferencias" 
          component={ConferenceStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Mapa" 
          component={MapScreen}
          options={{ title: 'Mapa del Evento' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
