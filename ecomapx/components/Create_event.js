import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Picker,
    StyleSheet,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CreateEvent() {
    const [nombre, setNombre] = useState('');
    const [banner, setBanner] = useState('');
    const [ubicacion, setUbicacion] = useState('Lima');
    const [descripcion, setDescripcion] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const [duracion, setDuracion] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    const navigation = useNavigation();

    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch('http://192.168.3.4:5000/create_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: nombre || '',
                    banner: banner || '',
                    ubicacion: ubicacion || '',
                    descripcion: descripcion || '',
                    capacidad: parseInt(capacidad) || 0,
                    duracion: parseInt(duracion) || 0,
                    fecha: fecha || '',
                    hora: hora || '',
                    status: 'Por Empezar',
                    resenas: [],
                    tag: '',
                    fotos: [],
                    descrip_detail: ''
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            Alert.alert("Éxito", "Evento creado con éxito!");
            navigation.goBack();  // Redirigir al usuario a la pantalla anterior

        } catch (error) {
            Alert.alert("Error", "Hubo un error al crear el evento.");
            console.error("Error creating event:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput placeholder="Banner" value={banner} onChangeText={setBanner} style={styles.input} />
            <Picker selectedValue={ubicacion} onValueChange={setUbicacion} style={styles.picker}>
                <Picker.Item label="Lima" value="Lima" />
                <Picker.Item label="Callao" value="Callao" />
            </Picker>
            <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={styles.input} />
            <TextInput placeholder="Capacidad" value={capacidad} onChangeText={setCapacidad} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Duración" value={duracion} onChangeText={setDuracion} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Fecha (DD/MM/YEAR)" value={fecha} onChangeText={setFecha} style={styles.input} />
            <TextInput placeholder="Hora (Ejemplo: 16:40)" value={hora} onChangeText={setHora} style={styles.input} />
            <Button title="Registrar Evento" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        width: '80%',
        padding: 10,
        margin: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    picker: {
        width: '80%',
        margin: 10,
    }
});