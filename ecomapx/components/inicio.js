import React, { useState, useEffect } from 'react';
import { Text, Image, StyleSheet, View } from 'react-native';

export default function Inicio() {
  const [showLogo, setShowLogo] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    //Después de 2.5 segundos, hago que se desvanezca el logo:
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
    }, 2500);

    //Después de 5 segundos en total, mostrar el "Bienvenid@":
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 5000);

    //Limpia los temporizadores cuando se desmonta el componente:
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
    };
  }, []);

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