import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

export default function Crimes({navigation}) {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('Current Location:', location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  if (!region) {
    console.log('Loading region...');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log('Region set, rendering map...');
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        followUserLocation={true}
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="DENUNCIAR" 
          onPress={() => navigation.navigate('RegisterCrime')} 
        />
      </View>
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
});