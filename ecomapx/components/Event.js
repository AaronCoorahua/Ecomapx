import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const Event = ({ route }) => {
    const { event } = route.params;

    if (!event) {
        return <Text>Error: Evento no encontrado</Text>;
    }
    
    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: event.fotos }} style={styles.image} />
            <Text style={styles.title}>{event.nombre}</Text>
            <Text style={styles.userId}>Creado por: {event.id_organizador}</Text>
            <Text style={styles.location}>{event.ubicacion}</Text>
            <Text style={styles.description}>{event.descripcion}</Text>
            <Text style={styles.detail}>{event.descrip_detail}</Text>
            <Text style={styles.tag}>{event.tag}</Text>
            <Text style={styles.capacity}>Capacidad: {event.capacidad}</Text>
            <Text style={styles.duration}>Duración: {event.duracion}</Text>
            <Text style={styles.date}>{event.fecha}</Text>
            <Text style={styles.time}>{event.hora}</Text>
            <Text style={styles.status}>{event.status}</Text>
            <Text style={styles.review}>Reseñas: {event.resenas}</Text>
            <Text style={styles.confirmed}>Confirmados: {event.confirmados}</Text>
            {/* Puedes continuar con más detalles aquí */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 10
    },
    userId: {
        fontSize: 14,
        color: 'grey',
        marginTop: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    location: {
        fontSize: 18
    },
    description: {
        fontSize: 16,
        marginTop: 10
    },
    detail: {
        fontSize: 16,
        marginTop: 10
    },
    tag: {
        fontSize: 14,
        color: 'grey',
        marginTop: 10
    },
    capacity: {
        fontSize: 16,
        marginTop: 10
    },
    duration: {
        fontSize: 16,
        marginTop: 10
    },
    date: {
        fontSize: 18,
        marginTop: 10
    },
    time: {
        fontSize: 18,
        marginTop: 10
    },
    status: {
        fontSize: 14,
        color: 'green',
        marginTop: 10
    },
    review: {
        fontSize: 16,
        marginTop: 10
    },
    confirmed: {
        fontSize: 16,
        marginTop: 10
    }
});

export default Event