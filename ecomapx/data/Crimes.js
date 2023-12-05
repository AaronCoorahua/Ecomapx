import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Button, Text, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

const crimeTypes = [
  "Robo agravado", "Robo agravado a mano armada", "Robo", "Hurto",
  "Hurto agravado", "Hurto de vehículo", "Asalto y robo de vehículos",
  "Homicidio calificado - Asesinato", "Homicidio por arma de fuego", "Otros..."
];

export default function Crimes({ route, navigation }) {
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [menuHeight, setMenuHeight] = useState(0);
  // Estado para almacenar las coordenadas del evento
  const [eventLocation, setEventLocation] = useState(null);

    // Este useEffect maneja los permisos y establece una ubicación por defecto
    useEffect(() => {
      (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              console.log('Permission to access location was denied');
              return;
          }

          // Si no hay coordenadas específicas en route.params, establece una ubicación por defecto
          if (!route.params) {
              let location = await Location.getCurrentPositionAsync({});
              setRegion({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
              });
          }
      })();
  }, []);

    // Este useEffect se ejecuta cuando hay cambios en route.params
    useEffect(() => {
      if (route.params) {
          const { latitude, longitude, eventName } = route.params;
          setRegion({
              latitude,
              longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
          });

          // Almacenar la ubicación del evento
          setEventLocation({ latitude, longitude, title: eventName });
      }
  }, [route.params]);

  const toggleMenu = () => {
    setMenuHeight(menuHeight === 0 ? '30%' : 0);
  };

  const handleOptionToggle = async (crimeType) => {
    const newSelectedOptions = { ...selectedOptions, [crimeType]: !selectedOptions[crimeType] };
    setSelectedOptions(newSelectedOptions);

    if (newSelectedOptions[crimeType]) {
      await fetchCrimeData(crimeType);
    } else {
      removeMarkersForCrimeType(crimeType);
    }
  };

  const fetchCrimeData = async (crimeType) => {
    try {
      const response = await fetch(`http://192.168.0.17:5000/get_crimes?tipo=${encodeURIComponent(crimeType)}`);
      const data = await response.json();
      const newMarkers = data.map(crime => ({
        latitude: parseFloat(crime.coordenadas.latitude),
        longitude: parseFloat(crime.coordenadas.longitude),
        type: crimeType
      }));

      setMarkers(markers => [...markers, ...newMarkers]);
    } catch (error) {
      console.error(error);
    }
  };

  const removeMarkersForCrimeType = (crimeType) => {
    setMarkers(markers => markers.filter(marker => marker.type !== crimeType));
  };

  const renderMenu = () => (
    <View style={[styles.menuContainer, { height: menuHeight }]}>
      <ScrollView style={styles.scrollView}>
        {crimeTypes.map((crimeType, index) => (
          <TouchableOpacity key={index} onPress={() => handleOptionToggle(crimeType)}>
            <Text style={styles.menuText}>
              {crimeType} {selectedOptions[crimeType] ? "(Seleccionado)" : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (!region) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        followUserLocation={true}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
          />
        ))}
        {eventLocation && (
            <Marker 
                coordinate={{ latitude: eventLocation.latitude, longitude: eventLocation.longitude }} 
                title={eventLocation.title || "Ubicación del Evento"}>
                <FontistoIcon name="map-marker-alt" size={26} color="#2C9840" style={styles.iconStyle} /> 
            </Marker>
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="DENUNCIAR" onPress={() => navigation.navigate('RegisterCrime')} />
        <Button title="FILTROS" onPress={toggleMenu} />
      </View>
      {renderMenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  menuText: {
    fontSize: 18,
    margin: 10,
  },
});
