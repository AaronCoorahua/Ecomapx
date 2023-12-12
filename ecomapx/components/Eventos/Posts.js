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
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';



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
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        if (viewType === 'ParaTi') {
            updateEvents();
        } else if (viewType === 'Siguiendo') {
            updateFollowedEvents();
        }
    }, [viewType]);

    useEffect(() => {
        // Esta función asincrónica obtiene el tipo de usuario del almacenamiento local
        const fetchUserType = async () => {
          try {
            const storedUserType = await AsyncStorage.getItem('rol');
            setUserType(storedUserType);
          } catch (error) {
            console.error('Error al recuperar el tipo de usuario', error);
          }
        };
    
        fetchUserType();
    }, []);

    return (
        <>
            {userType === 'ecobuscador' && (
            <View style={styles.viewTypeButtonsContainer}>
                <TouchableOpacity 
                    style={viewType === 'ParaTi' ? styles.activeButton : styles.inactiveButton}
                    onPress={() => setViewType('ParaTi')}
                >
                    <Text style={viewType === 'ParaTi' ? styles.activeButtonText : styles.inactiveButtonText}>Para Ti</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={viewType === 'Siguiendo' ? styles.activeButton : styles.inactiveButton}
                    onPress={() => setViewType('Siguiendo')}
                >
                    <Text style={viewType === 'Siguiendo' ? styles.activeButtonText : styles.inactiveButtonText}>Siguiendo</Text>
                </TouchableOpacity>
            </View>
            )}
            <FlatList
                data={currentEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.banner }} style={styles.image} />
                        <Text style={styles.name}>{item.nombre}</Text>
                        <View style={styles.locationContainer}>
                            <FontistoIcon name="map-marker-alt" size={20} marginTop={1} marginRight={5} marginLeft={4} color="#000" />
                            <Text style={styles.location}>{item.ubicacion}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <FontAwesome name="calendar" size={19} marginTop={5} paddingHorizontal={3} marginRight={1} color="#000" />
                            <Text style={styles.date}>{item.fecha}</Text>
                        </View>
                        <View style={styles.timeContainer}>
                            <AntDesign name="clockcircle" size={19} marginTop={1} paddingHorizontal={3} marginRight={1} color="#000" />
                            <Text style={styles.time}>{item.hora}</Text>
                        </View>
                        <View style={styles.statusContainer}>
                            <Ionicons name="list-status" size={24} marginTop={3} marginLeft={2} marginRight={2} color="#000" />
                            <Text style={getStatusStyle(item.status)}>{item.status}</Text>
                        </View>
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
    statusContainer:{
        flexDirection: 'row',
    },
    timeContainer:{
        flexDirection: 'row',
    },
    dateContainer:{
        flexDirection: 'row',
    },
    locationContainer:{
        flexDirection: 'row', // Alinea los elementos en una fila horizontal
    },
    viewTypeButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    activeButton: {
        backgroundColor: '#4DA769',
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
    activeButtonText: {
        color: '#FFF', // Color blanco para el texto del botón activo
        fontSize: 18,
        fontWeight: '300',
    },
    inactiveButtonText: {
        color: '#222', // Color oscuro para el texto del botón inactivo
        fontSize: 18,
        fontWeight: '300',
    },
    card: {
        padding: 10,
        marginBottom: -2,
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
        borderRadius: 16,
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
        marginTop:6,
    },
    statusEnProgreso: {
        fontSize: 14,
        color: 'orange',
        marginTop:6,
    },
    statusFinalizado: {
        fontSize: 14,
        color: 'red',
        marginTop:6,
    },
    statusDefault: {
        fontSize: 14,
        color: 'black', // Color por defecto
    },
    button: {
        padding: 10,
        backgroundColor: '#4DA769',
        borderRadius: 50,
        marginTop: 10,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize:17,
    },
});

export default Posts;