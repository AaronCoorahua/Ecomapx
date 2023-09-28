import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useAuthRequest, makeRedirectUri, ResponseType, useAutoDiscovery } from 'expo-auth-session';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const discovery = useAutoDiscovery('https://dev-0cd5cdcnogvggab1.us.auth0.com');

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Cmy6o5HPEfLTOGQuTrDZm9qxQXofHQRR',
      redirectUri: makeRedirectUri({
        useProxy: true,
      }),
      responseType: ResponseType.Token,
      scopes: ['openid', 'profile', 'email'],
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      setIsLoggedIn(true);
    }
  }, [response]);

  const login = async () => {
    await promptAsync();
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button title="Login with Auth0" onPress={login} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>You are logged in!</Text>
        <Image source={{ uri: 'https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png' }} style={{ width: 200, height: 200 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

