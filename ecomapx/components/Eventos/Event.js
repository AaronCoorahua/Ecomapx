import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import distritosSecurity from '../../assets/data/distritos.json';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const getSecurityIconColor = (securityLevel) => {
    if (securityLevel <= 3) {
        return 'green';
    } else if (securityLevel <= 7) {
        return 'yellow';
    } else {
        return 'red';
    }
};

const Event = ({ route }) => {
    const navigation = useNavigation();
    const { event } = route.params;

    if (!event) {
        return <Text>Error: Evento no encontrado</Text>;
    }

    const securityLevel = distritosSecurity.find(d => d.DISTRITOS === event.ubicacion)?.['NIVEL DE INSEGURIDAD'] || 'No disponible';
    const numericSecurityLevel = isNaN(securityLevel) ? 0 : parseInt(securityLevel, 10);
    const securityIconColor = getSecurityIconColor(numericSecurityLevel);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Image source={{ uri: event.banner }} style={styles.image} />
                <Text style={styles.title}>{event.nombre}</Text>
                <Text style={styles.userId}>Creado por: {event.id_organizador}</Text>
                <Text style={styles.location}>{event.ubicacion}</Text>
                <View style={styles.description}>
                    <Text>{event.descripcion}</Text>
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
                <MapView
                    style={styles.map}
                    region={{
                        latitude: parseFloat(event.coordenadas.latitude),
                        longitude: parseFloat(event.coordenadas.longitude),
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    pitchEnabled={false}
                    rotateEnabled={false}
                >
                    <Marker
                        coordinate={{
                            latitude: parseFloat(event.coordenadas.latitude),
                            longitude: parseFloat(event.coordenadas.longitude),
                        }}
                    />
                </MapView>
                <Ionicons name="alert-circle" size={30} color={securityIconColor} style={styles.securityIcon} />
                <View style={styles.nuevo}>
                    <Button title="Go to UserProfile" onPress={() => navigation.navigate('Profile')} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 10,
    },
    userId: {
        fontSize: 14,
        color: 'grey',
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    location: {
        fontSize: 18,
    },
    description: {
        fontSize: 16,
        marginTop: 15,
    },
    detail: {
        fontSize: 16,
        marginTop: 10,
    },
    tag: {
        fontSize: 14,
        color: 'grey',
        marginTop: 10,
    },
    capacity: {
        fontSize: 16,
        marginTop: 10,
    },
    duration: {
        fontSize: 16,
        marginTop: 10,
    },
    date: {
        fontSize: 18,
        marginTop: 10,
    },
    time: {
        fontSize: 18,
        marginTop: 10,
    },
    status: {
        fontSize: 14,
        color: 'green',
        marginTop: 10,
    },
    review: {
        fontSize: 16,
        marginTop: 10,
    },
    confirmed: {
        fontSize: 16,
        marginTop: 10,
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 20,
    },
    securityIcon: {
        position: 'absolute',
        top: 775,
        left: 25,
        zIndex: 1,
    },
    nuevo: {
        marginTop: 20,
    },
});

export default Event;
