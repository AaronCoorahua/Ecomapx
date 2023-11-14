import React, { useState, useEffect } from 'react';
import { Text, Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Paso 1

export default function Inicio() {
  const navigation = useNavigation(); // Paso 2

  const [showLogo, setShowLogo] = useState(true);


  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
      navigation.navigate('Homes')
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {showLogo && (
        <Image
          source={require('../../assets/logo2.png')} 
          style={styles.logo}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  logo: {
    width: 200, 
    height: 200, 
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1ABC9C', 
  },
  redirectText: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555', 
  },
});
