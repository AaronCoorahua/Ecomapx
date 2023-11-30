import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEvents } from '../Context/EventContext';

const Posts = () => {
    const { events, updateEvents } = useEvents();
    const navigation = useNavigation();

    // En Posts.js
    useEffect(() => {
        updateEvents();
    }, []); // Un array de dependencias vacío significa que este efecto solo se ejecutará una vez al montar el componente
  

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