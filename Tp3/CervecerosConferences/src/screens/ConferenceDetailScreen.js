import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';

const ConferenceDetailScreen = ({ route }) => {
  const { conference } = route.params;

  const handleOpenMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(conference.location)}`;
    Linking.openURL(url).catch(err => console.error('Error opening map:', err));
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: conference.image }} style={styles.coverImage} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{conference.title}</Text>
        
        <View style={styles.speakerSection}>
          <Text style={styles.speakerLabel}>👨‍🔬 Disertante:</Text>
          <Text style={styles.speakerName}>{conference.speaker}</Text>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>🕒 Horario:</Text>
          <Text style={styles.time}>
            {conference.startTime} - {conference.endTime}
          </Text>
        </View>

        <View style={styles.locationSection}>
          <Text style={styles.locationLabel}>📍 Ubicación:</Text>
          <TouchableOpacity onPress={handleOpenMap}>
            <Text style={styles.location}>{conference.location}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionLabel}>📋 Descripción:</Text>
          <Text style={styles.description}>{conference.description}</Text>
        </View>

        <View style={styles.topicsSection}>
          <Text style={styles.topicsLabel}>🎯 Temas a tratar:</Text>
          {conference.topics.map((topic, index) => (
            <Text key={index} style={styles.topic}>
              • {topic}
            </Text>
          ))}
        </View>

        {conference.speakerBio && (
          <View style={styles.bioSection}>
            <Text style={styles.bioLabel}>👤 Sobre el disertante:</Text>
            <Text style={styles.bio}>{conference.speakerBio}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  coverImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  speakerSection: {
    marginBottom: 16,
  },
  speakerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  speakerName: {
    fontSize: 18,
    color: '#FF6B35',
    fontWeight: '600',
  },
  timeSection: {
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '500',
  },
  locationSection: {
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  topicsSection: {
    marginBottom: 20,
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 8,
  },
  topicsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  topic: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 20,
  },
  bioSection: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 8,
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default ConferenceDetailScreen;