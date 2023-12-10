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

const getStatusStyle = (status) => {
    switch (status) {
        case 'Por Empezar':
            return styles.statusPorEmpezar;
        case 'En Progreso':
            return styles.statusEnProgreso;
        case 'Finalizado':
            return styles.statusFinalizado;
        default:
            return styles.statusDefault;
    }
};

const Posts = () => {
    const { events, updateEvents, followedEvents, updateFollowedEvents } = useEvents();
    const [viewType, setViewType] = useState('ParaTi'); // Valores podrían ser 'ParaTi' o 'Siguiendo'
    const navigation = useNavigation();
    const currentEvents = viewType === 'ParaTi' ? events : followedEvents;

    useEffect(() => {
        if (viewType === 'ParaTi') {
            updateEvents();
        } else if (viewType === 'Siguiendo') {
            updateFollowedEvents();
        }
    }, [viewType]);

    return (
        <>
            <View style={styles.viewTypeButtonsContainer}>
                <TouchableOpacity 
                    style={viewType === 'ParaTi' ? styles.activeButton : styles.inactiveButton}
                    onPress={() => setViewType('ParaTi')}
                >
                    <Text style={styles.buttonText2}>Para Ti</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={viewType === 'Siguiendo' ? styles.activeButton : styles.inactiveButton}
                    onPress={() => setViewType('Siguiendo')}
                >
                    <Text style={styles.buttonText2}>Siguiendo</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={currentEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.banner }} style={styles.image} />
                        <Text style={styles.name}>{item.nombre}</Text>
                        <Text style={styles.location}>{item.ubicacion}</Text>
                        <Text style={styles.date}>{item.fecha}</Text>
                        <Text style={styles.time}>{item.hora}</Text>
                        <Text style={getStatusStyle(item.status)}>{item.status}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Event', { event: item })}>
                            <Text style={styles.buttonText}>Ver más</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    viewTypeButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    activeButton: {
        backgroundColor: '#2C9840',
        marginLeft: 10,
        borderRadius: 4,
        marginHorizontal: 3, // Añade margen horizontal aquí
        paddingVertical: 5, // También puedes añadir algo de padding vertical si lo necesitas
        paddingHorizontal: 10, // Y padding horizontal
    },
    inactiveButton: {
        marginHorizontal: 3, // Añade margen horizontal aquí también
        paddingVertical: 5, // Y padding vertical si lo necesitas
        paddingHorizontal: 10, // Y padding horizontal
    },
    buttonText2: {
        color: '#222',
        fontSize: 18,
        fontWeight: '300',
    },
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
    statusPorEmpezar: {
        fontSize: 14,
        color: 'green',
    },
    statusEnProgreso: {
        fontSize: 14,
        color: 'orange',
    },
    statusFinalizado: {
        fontSize: 14,
        color: 'red',
    },
    statusDefault: {
        fontSize: 14,
        color: 'black', // Color por defecto
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