import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]); // Lista completa de Pokémon
  const [searchText, setSearchText] = useState(''); // Texto de búsqueda
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(false); // Estado de error
  const [refreshing, setRefreshing] = useState(false); // Estado de pull-to-refresh
  const [nextUrl, setNextUrl] = useState(null); // URL para página siguiente
  const [prevUrl, setPrevUrl] = useState(null); // URL para página anterior
  const [currentUrl, setCurrentUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=50'); // URL actual para fetchear
  const [cache, setCache] = useState({}); // Cache en memoria por URL

  // Obtener los insets para manejar la barra de navegación inferior
  const insets = useSafeAreaInsets();

  // Filtrado optimizado con useMemo en el nivel superior
  const filteredList = useMemo(() => {
    if (!searchText) return pokemonList;
    return pokemonList.filter((p) => p.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [pokemonList, searchText]);

  // Función para fetchear datos de la PokeAPI
  const fetchPokemon = async (url) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error de red');
      const data = await res.json();
      setPokemonList(data.results);
      setNextUrl(data.next); // Usar la URL exacta de la API
      setPrevUrl(data.previous); // Usar la URL exacta de la API
      // Guardar en cache usando la URL como clave
      setCache((prevCache) => ({ ...prevCache, [url]: data.results }));
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carga inicial y al cambiar la currentUrl
  useEffect(() => {
    if (cache[currentUrl]) {
      // Usar cache si existe para evitar flicker
      setPokemonList(cache[currentUrl]);
      // También actualizar next/prev desde cache si es necesario (simplificado)
      setLoading(false);
    } else {
      fetchPokemon(currentUrl);
    }
  }, [currentUrl]);

  // Manejar pull-to-refresh (refresca la URL actual)
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPokemon(currentUrl);
  };

  // Navegar a la página siguiente
  const handleNext = () => {
    if (nextUrl) {
      setCurrentUrl(nextUrl);
    }
  };

  // Navegar a la página anterior
  const handlePrev = () => {
    if (prevUrl) {
      setCurrentUrl(prevUrl);
    }
  };

  // Renderizar cada ítem de la lista
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {error ? (
        <Text style={styles.error}>Error de red. Desliza hacia abajo para reintentar.</Text>
      ) : loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : filteredList.length === 0 ? (
        <Text style={styles.noResults}>Sin resultados</Text>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.url}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        />
      )}
      <View style={[styles.pagination, { paddingBottom: insets.bottom + 16 }]}>
        <Button title="Anterior" onPress={handlePrev} disabled={!prevUrl} />
        <Button title="Siguiente" onPress={handleNext} disabled={!nextUrl} />
      </View>
    </SafeAreaView>
  );
};

// Envolver App en SafeAreaProvider
export default () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loading: {
    marginTop: 50,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
    fontSize: 16,
  },
  noResults: {
    textAlign: 'center',
    margin: 16,
    fontSize: 16,
    color: '#555',
  },
  listContent: {
    paddingBottom: 80, // Espacio base para los botones
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});