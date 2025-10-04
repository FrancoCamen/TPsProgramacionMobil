import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { conferences } from '../data/conferences';
import { saveConferences, getConferences } from '../utils/storage';

const ConferenceListScreen = ({ navigation }) => {
  const [conferencesData, setConferencesData] = useState([]);

  useEffect(() => {
    loadConferences();
  }, []);

  const loadConferences = async () => {
    try {
      let storedConferences = await getConferences();
      
      if (!storedConferences || storedConferences.length === 0) {
        // Si no hay datos guardados, guardamos los datos iniciales
        await saveConferences(conferences);
        storedConferences = conferences;
      }
      
      setConferencesData(storedConferences);
    } catch (error) {
      console.error('Error loading conferences:', error);
      setConferencesData(conferences); // Fallback a datos estáticos
    }
  };

  const renderConferenceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conferenceCard}
      onPress={() => navigation.navigate('ConferenceDetail', { conference: item })}
    >
      <Image source={{ uri: item.image }} style={styles.conferenceImage} />
      <View style={styles.conferenceInfo}>
        <Text style={styles.conferenceTitle}>{item.title}</Text>
        <Text style={styles.speakerName}>{item.speaker}</Text>
        <Text style={styles.conferenceTime}>
          🕒 {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.conferenceLocation}>📍 {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        🍻 Conferencias de Cerveceros Artesanales
      </Text>
      <Text style={styles.subtitle}>
        Descubre las mejores técnicas y tendencias cerveceras
      </Text>
      
      <FlatList
        data={conferencesData}
        renderItem={renderConferenceItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  conferenceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  conferenceImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  conferenceInfo: {
    padding: 16,
  },
  conferenceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 8,
  },
  conferenceTime: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 4,
  },
  conferenceLocation: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default ConferenceListScreen;