import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Pressable,
  Platform 
} from 'react-native';

// Definir tipos para TypeScript
type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  text: string;
  card: string;
  button: string;
  buttonText: string;
  disabledButton: string;
}

const useThemeStyles = (theme: Theme) => {
  const getThemeColors = (): ThemeColors => {
    if (theme === 'dark') {
      return {
        background: '#121212',
        text: '#FFFFFF',
        card: '#1E1E1E',
        button: '#BB86FC',
        buttonText: '#000000',
        disabledButton: '#555555'
      };
    }
    
    return {
      background: '#F5F5F5',
      text: '#333333',
      card: '#FFFFFF',
      button: '#6200EE',
      buttonText: '#FFFFFF',
      disabledButton: '#CCCCCC'
    };
  };

  const colors = getThemeColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    counterText: {
      fontSize: 72,
      fontWeight: 'bold',
      color: colors.text,
      marginVertical: 40,
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      marginTop: 20,
    },
    button: {
      backgroundColor: colors.button,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      minWidth: 100,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: colors.disabledButton,
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    toggleButton: {
      backgroundColor: colors.button,
      padding: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    warningText: {
      color: '#FF6B6B',
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    }
  });
};

const App = () => {
  const [count, setCount] = useState<number>(0);
  const [theme, setTheme] = useState<Theme>('light');
  
  const styles = useThemeStyles(theme);
  const isMaxCount = count >= 10;

  const handleIncrement = () => {
    if (count < 10) {
      setCount(count + 1);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Función para feedback visual en Pressable
  const getButtonStyle = ({ pressed }: { pressed: boolean }) => [
    styles.button,
    pressed && { opacity: 0.8 },
    isMaxCount && styles.buttonDisabled
  ];

  const getToggleButtonStyle = ({ pressed }: { pressed: boolean }) => [
    styles.toggleButton,
    pressed && { opacity: 0.8 }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.counterText}>{count}</Text>
        
        {isMaxCount && (
          <Text style={styles.warningText}>
            ¡Máximo alcanzado! (10)
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Pressable
            style={getButtonStyle}
            onPress={handleIncrement}
            disabled={isMaxCount}
            android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
          >
            <Text style={styles.buttonText}>+1</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleReset}
            android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>

        <Pressable
          style={getToggleButtonStyle}
          onPress={toggleTheme}
          android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <Text style={styles.buttonText}>
            {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default App;
