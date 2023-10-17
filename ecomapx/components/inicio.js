import React, { useState, useEffect } from 'react';
import { Text, Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Paso 1

export default function Inicio() {
  const navigation = useNavigation(); // Paso 2

  const [showLogo, setShowLogo] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
    }, 2500);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 5000);

    // Paso 3: Redireccionar después de un total de 7.5 segundos
    const redirectTimer = setTimeout(() => {
      navigation.navigate('Home');
    }, 7500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {showLogo && (
        <Image
          source={require('./../assets/logo2.png')} 
          style={styles.logo}
        />
      )}

      {showText && (
        <Text style={styles.welcomeText}>¡Bienvenid@!</Text>
      )}

      {!showLogo && !showText && (
        <Text style={styles.redirectText}>Redireccionando a la página de inicio de sesión...😀</Text>
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