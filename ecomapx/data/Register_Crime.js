import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

export default function RegisterCrime() {
  const [userId, setUserId] = useState(''); // Este valor se debería obtener del contexto de autenticación o almacenamiento local
  const [crimeType, setCrimeType] = useState('');
  const [details, setDetails] = useState('');
  const [region, setRegion] = useState({
    latitude: -12.046374,
    longitude: -77.0427934,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState({
    latitude: -12.046374,
    longitude: -77.0427934,
  });
  const navigation = useNavigation();

  const handleRegisterCrime = async () => {
    // Obtener el ID del usuario autenticado del almacenamiento local o del contexto de autenticación
    const authenticatedUserId = await AsyncStorage.getItem('userId'); // Asegúrate de que esta clave sea la correcta
    // No necesitas llamar a setUserId aquí, ya que sólo lo usarás para la petición POST
  
    if (!crimeType || !details) {
      Alert.alert('Error', 'Por favor, selecciona un tipo de crimen e ingresa los detalles.');
      return;
    }
  
    // Asegúrate de que las coordenadas sean un objeto con las propiedades latitude y longitude
    const formattedCoordinates = {
      latitude: marker.latitude,
      longitude: marker.longitude,
    };
  
    try {
      const token = await AsyncStorage.getItem('userToken');
      const crimeData = {
        user_id: authenticatedUserId, // Este campo no es necesario enviarlo si en el backend se obtiene del token JWT
        coordenadas: {
          latitude: marker.latitude.toString(),
          longitude: marker.longitude.toString(),
        },
        tipo: crimeType,
        detalles: details,
      };
  
      const response = await fetch('http://192.168.3.4:5000/add_crime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(crimeData),
      });
  
      const data = await response.json(); // Primero obtén la respuesta JSON
  
      if (!response.ok) {
        // En lugar de lanzar un error, maneja la respuesta de error adecuadamente
        console.error('Error al registrar el crimen:', data);
        Alert.alert('Error al registrar el crimen', data.error || 'Ocurrió un error desconocido');
        return;
      }
  
      Alert.alert('Éxito', 'Crimen registrado exitosamente');
      navigation.goBack(); // Regresar a la pantalla anterior
    } catch (error) {
      console.error('Error al registrar el crimen:', error);
      Alert.alert('Error', `Error al registrar el crimen: ${error}`);
    }
  };

  const onMapPress = (e) => {
    setMarker(e.nativeEvent.coordinate);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Picker selectedValue={crimeType} onValueChange={setCrimeType} style={styles.picker}>
              <Picker.Item label="Selecciona un tipo de crimen" value="" />
              <Picker.Item label="Robo agravado" value="Robo agravado" />
              <Picker.Item label="Robo agravado a mano armada" value="Robo agravado a mano armada" />
              <Picker.Item label="Robo" value="Robo" />
              <Picker.Item label="Hurto" value="Hurto" />
              <Picker.Item label="Hurto agravado" value="Hurto agravado" />
              <Picker.Item label="Hurto de vehículo" value="Hurto de vehículo" />
              <Picker.Item label="Asalto y robo de vehículos" value="Asalto y robo de vehículos" />
              <Picker.Item label="Homicidio calificado - Asesinato" value="Homicidio calificado - Asesinato" />
              <Picker.Item label="Homicidio por arma de fuego" value="Homicidio por arma de fuego" />
              <Picker.Item label="Otros..." value="Otros" />
            </Picker>
            <TextInput
              placeholder="Detalles del crimen"
              value={details}
              onChangeText={setDetails}
              style={styles.input}
              multiline
            />
            <MapView
              style={styles.map}
              initialRegion={region}
              onPress={onMapPress}
            >
              <Marker
                coordinate={marker}
                draggable
                onDragEnd={onMapPress}
              />
            </MapView>
            <View style={styles.registerCrime}>
              <Button title="Registrar Crimen" onPress={handleRegisterCrime} />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  input: {
    width: '100%',
    padding: 10,
    margin: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    width: '100%',
    margin: 10,
  },
  registerCrime: {
    marginTop: 30,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
});
