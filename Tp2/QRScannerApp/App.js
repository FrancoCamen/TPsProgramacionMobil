import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { CameraView, Camera } from 'expo-camera';

const App = () => {
  const [text, setText] = useState('');
  const [scannedData, setScannedData] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [parsedPayment, setParsedPayment] = useState(null);
  const cameraRef = useRef(null);

  // Solicitar permisos de cámara
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
        setHasPermission(false);
      }
    })();
    loadScanHistory();
  }, []);

  // Cargar historial
  const loadScanHistory = async () => {
    try {
      // Simulación de almacenamiento
      const storedHistory = await new Promise(resolve => 
        setTimeout(() => {
          try {
            const saved = localStorage?.getItem('qrScanHistory');
            resolve(saved ? JSON.parse(saved) : []);
          } catch {
            resolve([]);
          }
        }, 100)
      );
      setScanHistory(storedHistory || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Guardar en historial
  const saveToHistory = async (data) => {
    try {
      const newItem = {
        id: Date.now().toString(),
        data: data,
        timestamp: new Date().toLocaleString(),
        parsed: parsePaymentData(data)
      };
      
      const newHistory = [newItem, ...scanHistory.slice(0, 9)];
      setScanHistory(newHistory);
      
      await new Promise(resolve => setTimeout(() => {
        try {
          localStorage?.setItem('qrScanHistory', JSON.stringify(newHistory));
        } catch (error) {
          console.warn('Could not save to storage:', error);
        }
        resolve();
      }, 100));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  // Manejar escaneo de código de barras
  const handleBarcodeScanned = ({ data }) => {
    setIsScanning(false);
    setScannedData(data);
    setParsedPayment(parsePaymentData(data));
    saveToHistory(data);
    Alert.alert('✅ Escaneo exitoso', `Código escaneado: ${data}`);
  };

  // Parsear datos de pago
  const parsePaymentData = (data) => {
    if (data && typeof data === 'string' && data.startsWith('PAY:')) {
      const parts = data.split('|');
      if (parts.length >= 3) {
        return {
          type: 'payment',
          id: parts[0].replace('PAY:', ''),
          amount: parts[1],
          currency: parts[2],
          description: parts[3] || ''
        };
      }
    }
    return null;
  };

  // Copiar al portapapeles
  const copyToClipboard = async () => {
    if (scannedData) {
      try {
        await Clipboard.setStringAsync(scannedData);
        Alert.alert('📋 Copiado', 'Texto copiado al portapapeles');
      } catch (error) {
        Alert.alert('❌ Error', 'No se pudo copiar al portapapeles');
      }
    }
  };

  // Limpiar historial
  const clearHistory = async () => {
    try {
      setScanHistory([]);
      await new Promise(resolve => setTimeout(() => {
        try {
          localStorage?.removeItem('qrScanHistory');
        } catch (error) {
          console.warn('Could not clear storage:', error);
        }
        resolve();
      }, 100));
      Alert.alert('🗑️ Historial limpiado');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  // Simular escaneo para testing
  const simulateScan = () => {
    const testData = 'PAY:12345|100|ARS|Pago de servicio';
    setScannedData(testData);
    setParsedPayment(parsePaymentData(testData));
    saveToHistory(testData);
    Alert.alert('🧪 Escaneo simulado', `Código: ${testData}`);
  };

  // Renderizar vista de escáner
  const renderScanner = () => {
    if (isScanning) {
      return (
        <View style={styles.container}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'pdf417']
            }}
            onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
          />
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Escanea el código QR</Text>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setIsScanning(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  if (isScanning) {
    return renderScanner();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Sección de generación de QR */}
      <View style={styles.section}>
        <Text style={styles.title}>🎨 Generar Código QR</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el texto a codificar..."
          value={text}
          onChangeText={setText}
        />
        {text ? (
          <View style={styles.qrContainer}>
            <QRCode
              value={text}
              size={200}
              backgroundColor="white"
              color="black"
            />
          </View>
        ) : (
          <Text style={styles.placeholderText}>
            Ingresa texto para generar el QR
          </Text>
        )}
      </View>

      {/* Sección de escaneo */}
      <View style={styles.section}>
        <Text style={styles.title}>📷 Escanear Código QR</Text>
        
        {hasPermission === null && (
          <Text style={styles.permissionText}>⏳ Solicitando permisos de cámara...</Text>
        )}
        
        {hasPermission === false && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              📷 Permisos de cámara denegados
            </Text>
            <Text style={styles.warningSubtext}>
              Para escanear códigos QR, necesitas permitir el acceso a la cámara en la configuración de tu dispositivo.
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.scanButton, 
            hasPermission === false && styles.disabledButton
          ]}
          onPress={() => setIsScanning(true)}
          disabled={hasPermission === false}
        >
          <Text style={styles.scanButtonText}>
            {hasPermission === false ? 'Permisos Denegados' : 'Escanear QR'}
          </Text>
        </TouchableOpacity>

        {/* Botón para simular escaneo */}
        <TouchableOpacity 
          style={[styles.scanButton, styles.simulateButton]}
          onPress={simulateScan}
        >
          <Text style={styles.scanButtonText}>🧪 Simular Escaneo (Testing)</Text>
        </TouchableOpacity>

        {scannedData && (
          <View style={styles.scannedDataContainer}>
            <Text style={styles.scannedTitle}>📄 Último código escaneado:</Text>
            <Text style={styles.scannedData}>{scannedData}</Text>
            
            {parsedPayment && (
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>💳 Información de Pago:</Text>
                <Text>🆔 ID: {parsedPayment.id}</Text>
                <Text>💰 Monto: {parsedPayment.amount}</Text>
                <Text>💵 Moneda: {parsedPayment.currency}</Text>
                {parsedPayment.description && (
                  <Text>📝 Descripción: {parsedPayment.description}</Text>
                )}
              </View>
            )}

            <TouchableOpacity 
              style={styles.copyButton}
              onPress={copyToClipboard}
            >
              <Text style={styles.copyButtonText}>📋 Copiar al portapapeles</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Historial de escaneos */}
      {scanHistory.length > 0 && (
        <View style={styles.section}>
          <View style={styles.historyHeader}>
            <Text style={styles.title}>📜 Historial de Escaneos</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearHistoryText}>🗑️ Limpiar</Text>
            </TouchableOpacity>
          </View>
          {scanHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.historyData}>{item.data}</Text>
              <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
              {item.parsed && (
                <Text style={styles.historyPayment}>
                  💰 Pago: {item.parsed.amount} {item.parsed.currency}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  permissionText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 6,
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  warningText: {
    color: '#856404',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  warningSubtext: {
    color: '#856404',
    fontSize: 12,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  simulateButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannedDataContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  scannedTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  scannedData: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 4,
  },
  paymentInfo: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  paymentTitle: {
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  copyButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  copyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearHistoryText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  historyData: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  historyPayment: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default App;