import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  TextInput,
  Text,
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
import DateTimePicker from '@react-native-community/datetimepicker';


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

  //otras cosas:
  const [mode, setMode] = useState('time');
  // Inicializa 'date' con una fecha que tenga la hora y minutos en cero
  const [date, setDate] = useState(new Date(new Date().setHours(0,0,0,0)));

  // Estado para la instancia de Date utilizada por DateTimePicker
  const [timePickerValue, setTimePickerValue] = useState(new Date());

  const { updateEvents } = useEvents(); // Utiliza el hook useEvents para acceder a la función de actualización

  const navigation = useNavigation();

  // Función para restablecer los estados a sus valores iniciales
  const resetForm = () => {
    setPuntaje(0);
    setStatus('Por Empezar');
    setDescripDetail('');
    setTag('');
    setResenas([]);
    setConfirmados(0);
    setNombre('');
    setBanner('');
    setUbicacion('Lima');
    setDescripcion('');
    setCapacidad('');
    setDate(new Date(new Date().setHours(0,0,0,0))); // Restablecer el reloj a 00:00
    setDuracion(0); // Restablecer la duración a 0 minutos
    setFecha('');
    const now = new Date();
    setTimePickerValue(now); // Restablece el selector de hora a la hora actual
    setHora(formatHour(now)); // Restablece la hora formateada a la hora actual
    setRegion({
      latitude: -12.046374,
      longitude: -77.0427934,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarker({
      latitude: -12.046374,
      longitude: -77.0427934,
    });
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    setDuracion(hours * 60 + minutes); // Almacena la duración en minutos
  };

  // Función para manejar los cambios en el selector de hora
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || timePickerValue;
    setTimePickerValue(currentTime); // Actualiza el estado con la nueva instancia de Date

    // Formatea la hora y los minutos a una cadena HH:MM y actualiza el estado de hora
    const formattedTime = formatHour(currentTime);
    setHora(formattedTime);
  };

  // Función para formatear la hora a una cadena HH:MM
  const formatHour = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Restablecer el formulario cuando la pantalla gana el foco
  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [])
  );

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
              <Picker.Item label="Ancón" value="Ancón" />
              <Picker.Item label="Ate" value="Ate" />
              <Picker.Item label="Barranco" value="Barranco" />
              <Picker.Item label="Breña" value="Breña" />
              <Picker.Item label="Carabayllo" value="Carabayllo" />
              <Picker.Item label="Chaclacayo" value="Chaclacayo" />
              <Picker.Item label="Chorrillos" value="Chorrillos" />
              <Picker.Item label="Cieneguilla" value="Cieneguilla" />
              <Picker.Item label="Comas" value="Comas" />
              <Picker.Item label="El Agustino" value="El Agustino" />
              <Picker.Item label="Independencia" value="Independencia" />
              <Picker.Item label="Jesús María" value="Jesús María" />
              <Picker.Item label="La Molina" value="La Molina" />
              <Picker.Item label="La Victoria" value="La Victoria" />
              <Picker.Item label="Cercado de Lima" value="Cercado de Lima" />
              <Picker.Item label="Lince" value="Lince" />
              <Picker.Item label="Los Olivos" value="Los Olivos" />
              <Picker.Item label="Lurigancho" value="Lurigancho" />
              <Picker.Item label="Lurín" value="Lurín" />
              <Picker.Item label="Magdalena del Mar" value="Magdalena del Mar" />
              <Picker.Item label="Miraflores" value="Miraflores" />
              <Picker.Item label="Pachacámac" value="Pachacámac" />
              <Picker.Item label="Pucusuna" value="Pucusuna" />
              <Picker.Item label="Pueblo Libre" value="Pueblo Libre" />
              <Picker.Item label="Puente Piedra" value="Puente Piedra" />
              <Picker.Item label="Punta Hermosa" value="Punta Hermosa" />
              <Picker.Item label="Punta Negra" value="Punta Negra" />
              <Picker.Item label="Rímac" value="Rímac" />
              <Picker.Item label="San Bartolo" value="San Bartolo" />
              <Picker.Item label="San Borja" value="San Borja" />
              <Picker.Item label="San Isidro" value="San Isidro" />
              <Picker.Item label="San Juan de Lurigancho" value="San Juan de Lurigancho" />
              <Picker.Item label="San Juan de Miraflores" value="San Juan de Miraflores" />
              <Picker.Item label="San Luis" value="San Luis" />
              <Picker.Item label="San Martín de Porres" value="San Martín de Porres" />
              <Picker.Item label="San Miguel" value="San Miguel" />
              <Picker.Item label="Santa Anita" value="Santa Anita" />
              <Picker.Item label="Santa María del Mar" value="Santa María del Mar" />
              <Picker.Item label="Santa Rosa" value="Santa Rosa" />
              <Picker.Item label="Santiago de Surco" value="Santiago de Surco" />
              <Picker.Item label="Surquillo" value="Surquillo" />
              <Picker.Item label="Villa El Salvador" value="Villa El Salvador" />
              <Picker.Item label="Villa María del Triunfo" value="Villa María del Triunfo" />
            </Picker>
            <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={styles.input} />
            <TextInput placeholder="Capacidad" value={capacidad} onChangeText={setCapacidad} keyboardType="numeric" style={styles.input} />
            <Text style={styles.label}>Duración:</Text>
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChange}
                style={styles.timePicker} // Añade estilos si es necesario
            />
            <TextInput placeholder="Fecha (DD/MM/YYYY)" value={fecha} onChangeText={setFecha} style={styles.input} />
            <Text style={styles.label}>Hora:</Text>
            <DateTimePicker
              testID="timePicker1"
              value={timePickerValue}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
              style={styles.timePicker}
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
  timePicker: {
    alignSelf:'center',
  },
  label: {
    // Estilos para la etiqueta de la duración
    fontSize: 16,
    fontWeight: 500,
    marginLeft: 10,
    color: '#222',
},
  timeText: {
    // Estilos para el texto de la hora
    fontSize: 18,
    color: 'blue', // o el color que prefieras
    textDecorationLine: 'underline',
  },
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