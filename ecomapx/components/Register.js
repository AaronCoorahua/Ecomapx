import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'

export default function Register({ onSuccessfulRegister }) {
    const [userType, setUserType] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [b_date, setB_date] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [genero, setGenero] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!nombre || !apellidos || !b_date || !email || !contrasena || !genero || !userType) {
            Alert.alert('Error', 'Por favor, rellena todos los campos.');
            return;
        }

        console.log('Intentando registrar...');
        try {
            const response = await fetch('http://192.168.3.4:5000/register', {
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
                navigation.navigate('Login'); // Navegación automática al login después de un registro exitoso
            } else {
                Alert.alert('Error', data.error || 'Error al registrar.');
            }
        } catch (error) {
          
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <Text>Tipo de Usuario</Text>
            <Picker
                selectedValue={userType}
                style={styles.input}
                onValueChange={(itemValue) => setUserType(itemValue)}
            >
                <Picker.Item label="Selecciona un tipo de usuario" value="" />
                <Picker.Item label="Ecobuscador" value="ecobuscador" />
                <Picker.Item label="Ecoorganizador" value="ecoorganizador" />
            </Picker>

            <Text>Nombre</Text>
            <TextInput
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
            />

            <Text>Apellidos</Text>
            <TextInput
                placeholder="Ingresa tus apellidos"
                value={apellidos}
                onChangeText={setApellidos}
                style={styles.input}
            />

            <Text>Fecha de Nacimiento</Text>
            <TextInput
                placeholder="YYYY-MM-DD"
                value={b_date}
                onChangeText={setB_date}
                style={styles.input}
                onBlur={() => {
                    const regex = /^\d{4}-\d{2}-\d{2}$/;
                    if (!regex.test(b_date)) {
                        Alert.alert('Error', 'Formato de fecha no válido.');
                        setB_date('');
                    }
                }}
            />

            <Text>Email</Text>
            <TextInput
                placeholder="Ingresa tu email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <Text>Contraseña</Text>
            <TextInput
                placeholder="Ingresa una contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                style={styles.input}
                secureTextEntry
            />

            <Text>Género</Text>
            <Picker
                selectedValue={genero}
                style={styles.input}
                onValueChange={(itemValue) => setGenero(itemValue)}
            >
                <Picker.Item label="Selecciona un género" value="" />
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Femenino" value="femenino" />
                <Picker.Item label="Otro" value="otro" />
            </Picker>

            <Button title="Registrar" onPress={handleRegister} />
            
            {/* Botón para regresar al login */}
            <Button title="Regresar al Login" onPress={() => navigation.navigate('Login')} />
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