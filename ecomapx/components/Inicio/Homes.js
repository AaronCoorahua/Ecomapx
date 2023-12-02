import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Homes() {

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo2.png')}
        style={styles.logo}
      />
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <Text style={styles.text}>¿Aún no tienes una cuenta?</Text>
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
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
    marginBottom: 20,
  },
  text: {
    marginTop: 20,
    marginBottom: 20,
  },
});