import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, KeyboardAvoidingView} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Event = ({ route }) => {
    const navigation = useNavigation();
    const { event } = route.params;

    if (!event) {
        return <Text>Error: Evento no encontrado</Text>;
    }
    
    return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Image source={{ uri: event.banner }} style={styles.image} />
            <Text style={styles.title}>{event.nombre}</Text>
            <Text style={styles.userId}>Creado por: {event.id_organizador}</Text>
            <Text style={styles.location}>{event.ubicacion}</Text>
            <View style={styles.description}>
            <Text >{event.descripcion}</Text>
            </View>
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
            <View style={styles.nuevo}>
            <Button title="Go to UserProfile" onPress={() => navigation.navigate('UserProfile')} />
            </View>
        </ScrollView>
       </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
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
        marginTop: 15,
        marginBottom: -55,
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
    },
    scrollViewContent: {
        padding: 20,
        backgroundColor:'#F5F5F5',
    },
    nuevo: {
        marginTop:20,
    },
});

export default Event