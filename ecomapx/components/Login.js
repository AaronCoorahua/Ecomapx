import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login({ onSuccessfulLogin }) {
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [userType, setUserType] = useState('');  // 'ecobuscador' or 'ecoorganizador'
    const navigation = useNavigation();
    const handleLogin = async () => {
        console.log('Intentando iniciar sesión...');
        if (!email || !contrasena || !userType) {
            Alert.alert('Error', 'Por favor, rellena todos los campos.');
            return;
        }
    
        try {
            const response = await fetch('http://192.168.3.4:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_type: userType,
                    email: email,
                    contrasena: contrasena
                })
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                if (data.message === 'Logged in successfully') {
                    console.log('Inicio de sesión exitoso. Navegando a Posts...');
                    await AsyncStorage.setItem('userToken', data.token);
                    //onSuccessfulLogin();
                    navigation.navigate('Posts')
                } else {
                    Alert.alert('Error', data.error || 'Error al iniciar sesión.');
                }
            }
        } catch (error) {
            // Si hay algún error en el proceso de fetch, lo mostramos
            Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email:</Text>
            <TextInput 
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.label}>Contraseña:</Text>
            <TextInput 
                style={styles.input}
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry
            />

            <View style={styles.buttonGroup}>
                <Button 
                    title="Eco Buscador" 
                    onPress={() => setUserType('ecobuscador')} 
                    color={userType === 'ecobuscador' ? 'blue' : 'gray'}
                />
                <Button 
                    title="Eco Organizador" 
                    onPress={() => setUserType('ecoorganizador')} 
                    color={userType === 'ecoorganizador' ? 'blue' : 'gray'}
                />
            </View>

            <Button title="Ingresar" onPress={handleLogin} />
            <Text style={{ textAlign: 'center', marginTop: 20 }}>¿No tienes una cuenta?</Text>
            <Button title="Regístrate" onPress={() => navigation.navigate('Register')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});