import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function Register({ onSuccessfulRegister }) {
    const [userType, setUserType] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [b_date, setB_date] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [genero, setGenero] = useState('');

    const handleRegister = async () => {
        if (!nombre || !apellidos || !b_date || !email || !contrasena || !genero || !userType) {
            Alert.alert('Error', 'Por favor, rellena todos los campos.');
            return;
        }

        try {
            const response = await fetch('http://10.100.225.244:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_type: userType,
                    nombre: nombre,
                    apellidos: apellidos,
                    b_date: b_date,
                    email: email,
                    contrasena: contrasena,
                    genero: genero
                })
            });

            const data = await response.json();

            if (response.status === 201) {
                onSuccessfulRegister();
            } else {
                Alert.alert('Error', data.error || 'Error al registrar.');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>
            <TextInput
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
            />
            <TextInput
                placeholder="Apellidos"
                value={apellidos}
                onChangeText={setApellidos}
                style={styles.input}
            />
            <TextInput
                placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
                value={b_date}
                onChangeText={setB_date}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                style={styles.input}
                secureTextEntry={true}
            />
            <TextInput
                placeholder="Género (M/F)"
                value={genero}
                onChangeText={setGenero}
                style={styles.input}
            />
            {/* Aquí puedes agregar un selector o botones para escoger entre 'ecobuscador' y 'ecoorganizador' para el userType */}
            <Button title="Registrar" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
    },
});