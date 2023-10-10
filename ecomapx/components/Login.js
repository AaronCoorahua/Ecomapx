import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function Login({ onSuccessfulLogin }) {
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [userType, setUserType] = useState('');  // 'ecobuscador' or 'ecoorganizador'

    const handleLogin = async () => {
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
                onSuccessfulLogin();
            } else {
                Alert.alert('Error', data.error || 'Ocurrió un error al hacer login.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ocurrió un error al comunicarse con el servidor.');
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