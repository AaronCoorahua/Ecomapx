import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Posts = () => {
    const [events, setEvents] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obteniendo el token del localStorage
                const token = await AsyncStorage.getItem('userToken');

                const response = await fetch('http://192.168.0.16:5000/listEvents', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchData();
    }, []);
    return (
        <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Image source={{ uri: item.banner }} style={styles.image} />
                    <Text style={styles.name}>{item.nombre}</Text>
                    <Text style={styles.userId}>Creado por: {item.user_id}</Text>
                    <Text style={styles.location}>{item.ubicacion}</Text>
                    <Text style={styles.tag}>{item.tag}</Text>
                    <Text style={styles.date}>{item.fecha}</Text>
                    <Text style={styles.time}>{item.hora}</Text>
                    <Text style={styles.status}>{item.status}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Event', { event: item })}>
                        <Text style={styles.buttonText}>Ver más</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        marginBottom: 10,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
    },
    userId: {
        fontSize: 14,
        color: 'grey',
        marginTop: 10
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    location: {
        fontSize: 16,
    },
    tag: {
        fontSize: 14,
        color: 'grey',
    },
    date: {
        fontSize: 16,
        marginVertical: 5,
    },
    time: {
        fontSize: 16,
    },
    status: {
        fontSize: 14,
        color: 'green',
    },
    button: {
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default Posts;