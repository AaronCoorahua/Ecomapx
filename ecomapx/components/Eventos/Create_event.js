import React, { useState } from 'react';
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
import { useEvents } from '../Context/EventContext';


export default function CreateEvent() {
  const [puntaje, setPuntaje] = useState(0); // Asumiendo que puntaje es opcional y puede ser cero por defecto
  const [status, setStatus] = useState('Por Empezar'); 
  const [descripDetail, setDescripDetail] = useState('');
  const [tag, setTag] = useState('');
  const [resenas, setResenas] = useState([]);
  const [confirmados, setConfirmados] = useState(0);
  const [nombre, setNombre] = useState('');
  const [banner, setBanner] = useState('');
  const [ubicacion, setUbicacion] = useState('Lima');
  const [descripcion, setDescripcion] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [duracion, setDuracion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
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

  const { updateEvents } = useEvents(); // Utiliza el hook useEvents para acceder a la función de actualización

  const navigation = useNavigation();


  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const event = {
        nombre: nombre,
        banner: banner,
        ubicacion: ubicacion,
        puntaje: puntaje,
        descripcion: descripcion,
        descrip_detail: descripDetail,
        tag: tag,
        capacidad: parseInt(capacidad, 10),
        duracion: parseInt(duracion, 10),
        fecha: fecha,
        hora: hora,
        status: status,
        resenas: resenas,
        confirmados: confirmados,
        coordenadas: {
          latitude: marker.latitude,
          longitude: marker.longitude,
        },
      };

      const response = await fetch('http://192.168.0.17:5000/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Si la creación del evento es exitosa, actualiza la lista de eventos
      Alert.alert("Éxito", "Evento creado con éxito!");
      updateEvents(); // Llama a updateEvents para actualizar la lista global de eventos
      navigation.goBack(); // Vuelve a la pantalla anterior

    } catch (error) {
      Alert.alert("Error", "Hubo un error al crear el evento.");
      console.error("Error creating event:", error);
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
            <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput placeholder="Banner" value={banner} onChangeText={setBanner} style={styles.input} />
            <Picker selectedValue={ubicacion} onValueChange={setUbicacion} style={styles.picker}>
              <Picker.Item label="Lima" value="Lima" />
              <Picker.Item label="Callao" value="Callao" />
            </Picker>
            <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={styles.input} />
            <TextInput placeholder="Capacidad" value={capacidad} onChangeText={setCapacidad} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Duración" value={duracion} onChangeText={setDuracion} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Fecha (DD/MM/YYYY)" value={fecha} onChangeText={setFecha} style={styles.input} />
            <TextInput placeholder="Hora (HH:MM)" value={hora} onChangeText={setHora} style={styles.input} />
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
            <View style={styles.registerEvent}>
              <Button title="Registrar Evento" onPress={handleSubmit} />
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
  registerEvent: {
    marginTop: 30,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
});