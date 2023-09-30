import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground } from 'react-native';
import { useAuthRequest, makeRedirectUri, ResponseType, useAutoDiscovery } from 'expo-auth-session';
import Inicio from './components/inicio';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = useState(true);

  const discovery = useAutoDiscovery('https://dev-0cd5cdcnogvggab1.us.auth0.com');

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Cmy6o5HPEfLTOGQuTrDZm9qxQXofHQRR',
      redirectUri: makeRedirectUri({
        useProxy: true,
      }),
      responseType: ResponseType.Token,
      scopes: ['openid', 'profile', 'email'],
      prompt: 'login'  // Aquí agregas el parámetro "prompt"
    },
    discovery
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      setIsLoggedIn(true);
    }
  }, [response]);

  const login = async () => {
    await promptAsync();
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  if (loading) {
    return <Inicio />;
  }

  return (
    <ImageBackground source={require('./assets/larcomar.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        { !isLoggedIn ? (
          <>
            <Text style={styles.text}>Start working on your app!</Text>
            <Button title="Login with Auth0" onPress={login} />
          </>
        ) : (
          <>
            <Text style={styles.text}>You are logged in!</Text>
            <Image source={{ uri: 'https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png' }} style={{ width: 200, height: 200 }} />
            <Button title="Logout" onPress={logout} />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
});
