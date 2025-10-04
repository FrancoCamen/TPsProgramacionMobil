import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Linking,
  TouchableOpacity
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  // Coordenadas del evento (ejemplo: Buenos Aires)
  const eventLocation = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const conferenceLocations = [
    {
      id: 1,
      title: 'Sala Principal',
      description: 'Conferencias magistrales',
      coordinate: {
        latitude: -34.6037,
        longitude: -58.3816,
      },
    },
    {
      id: 2,
      title: 'Sala Técnica',
      description: 'Talleres especializados',
      coordinate: {
        latitude: -34.6040,
        longitude: -58.3820,
      },
    },
    {
      id: 3,
      title: 'Zona de Degustación',
      description: 'Cata de cervezas artesanales',
      coordinate: {
        latitude: -34.6035,
        longitude: -58.3810,
      },
    },
  ];

  const handleOpenInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${eventLocation.latitude},${eventLocation.longitude}`;
    Linking.openURL(url).catch(err => console.error('Error opening maps:', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Mapa del Evento</Text>
      <Text style={styles.subtitle}>
        Centro de Convenciones Cervecero Artesanal
      </Text>

      <MapView
        style={styles.map}
        initialRegion={eventLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {conferenceLocations.map(location => (
          <Marker
            key={location.id}
            coordinate={location.coordinate}
            title={location.title}
            description={location.description}
            pinColor="#FF6B35"
          />
        ))}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Leyenda:</Text>
        <Text style={styles.legendItem}>🔴 Sala Principal - Conferencias magistrales</Text>
        <Text style={styles.legendItem}>🔴 Sala Técnica - Talleres especializados</Text>
        <Text style={styles.legendItem}>🔴 Zona de Degustación - Cata de cervezas</Text>
      </View>

      <TouchableOpacity style={styles.openMapsButton} onPress={handleOpenInMaps}>
        <Text style={styles.openMapsButtonText}>Abrir en Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
  },
  legend: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  legendItem: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  openMapsButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  openMapsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;