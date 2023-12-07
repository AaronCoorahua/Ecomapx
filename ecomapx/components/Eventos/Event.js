import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, KeyboardAvoidingView, Alert, Modal,TouchableOpacity,  ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import distritosSecurity from '../../data/distritos.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Rating, AirbnbRating } from 'react-native-ratings';
import {FontAwesome} from '@expo/vector-icons';
// Importando el Logo de Google Maps:
import gmaps from '../../assets/logo-gmaps.png'; 

const getSecurityIconColor = (securityLevel) => {
    if (securityLevel <= 3) {
        return 'green';
    } else if (securityLevel <= 7) {
        return 'yellow';
    } else {
        return 'red';
    }
};

const StarDisplay = ({ new_average }) => {
    console.log('Tipo de new_average:', typeof new_average);
    console.log('Valor de new_average:', new_average);
    // Verificar que new_average es un número y está definido
    const displayValue = typeof new_average === 'number' ? new_average.toFixed(1) : '0.0';

    return (
        <View style={styles.starDisplayContainer}>
          <AntDesign name="star" size={28.5} color="#FFD700" style={styles.starIcon} />
          <Text style={styles.ratingText}>{displayValue}</Text>
          <Text style={styles.ratingOutOf}>/ 5</Text>
        </View>
      );
  };

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


const Event = ({ route }) => {
    const navigation = useNavigation();
    //const { event } = route.params;
    const { event: initialEvent } = route.params;
    const [event, setEvent] = useState(initialEvent); // Nuevo estado para el evento
    // Estados para controlar la puntuación y la visibilidad del modal
    // Asegúrate de que starCount se inicializa como un número
    const [starCount, setStarCount] = useState(0.0); // Puntuación actual
    const [tempStarCount, setTempStarCount] = useState(0.0); // Puntuación temporal para el modal
    const [modalVisible, setModalVisible] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userAssistedEvents, setUserAssistedEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasUserRated, setHasUserRated] = useState(false);
    const [organizerName, setOrganizerName] = useState('');

    // Función para determinar si se debe mostrar el botón de puntuar
    const shouldShowRateButton = () => {
        return userRole === 'ecobuscador' && isUserRegistered() && event.status === 'Finalizado';
    };

    const showLoadingIndicatorOrCheck = () => {
        // Si se está cargando algo, muestra el indicador de carga, pero solo si el usuario está registrado
        // o el evento no está en un estado de "Finalizado" o "En Progreso" sin registro del usuario
        if (isLoading && (isUserRegistered() || !['Finalizado', 'En Progreso'].includes(event.status))) {
            console.log("Mostrando ActivityIndicator");
            return <ActivityIndicator size="large" color="#0000ff" />;
        }
    
        // Si el usuario está registrado y el evento está en un estado relevante, muestra el check
        if (isUserRegistered() && ['En Progreso', 'Finalizado', 'Por Empezar'].includes(event.status)) {
            console.log("Mostrando Check");
            return (
                <View style={styles.checkButton}>
                    <FontAwesome5 name="check" size={24} color="black" />
                </View>
            );
        }
    };

    // La función para mostrar el botón de asistir permanece igual
    const shouldShowAssistButton = () => {
        // Muestra el botón si el usuario es ecobuscador, no ha confirmado asistencia,
        // el evento está por empezar, y no se está cargando nada
        return userRole === 'ecobuscador' && !isUserRegistered() && event.status === 'Por Empezar' && !isLoading;
    };

    const handleNavigateToCrimeData = () => {
        navigation.navigate('Crimes', {
            latitude: event.coordenadas.latitude,
            longitude: event.coordenadas.longitude,
            eventName: event.nombre 
        });
    };

    const fetchOrganizerDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`http://192.168.0.17:5000/get_organizer_details/${event.id_organizador}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                const organizerData = await response.json();
                setOrganizerName(`${organizerData.nombres} ${organizerData.apellidos}`);
            } else {
                console.error('Error al obtener detalles del organizador:', response.status);
            }
        } catch (error) {
            console.error('Error al conectar con el backend para obtener detalles del organizador', error);
        }
    };
    

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`http://192.168.0.17:5000/event_details/${event.id}`, {
                headers: {
                    // Configuración de headers...
                }
            });

            if (response.ok) {
                const updatedEvent = await response.json();
                setStarCount(parseFloat(updatedEvent.puntaje)); // Actualizar con el promedio actualizado
                setTempStarCount(parseFloat(updatedEvent.puntaje)); // También actualiza la puntuación temporal

                // Comprueba si el usuario ya ha calificado el evento
                const userId = await AsyncStorage.getItem('userId');
                if (updatedEvent.ratings2 && updatedEvent.ratings2[userId]) {
                    setHasUserRated(true);
                } else {
                    setHasUserRated(false);
                }

            } else {
                console.error('Error al obtener detalles del evento');
            }
        } catch (error) {
            console.error('Error al conectar con el backend', error);
        }
    };

    useEffect(() => {
        // Llama a ambas funciones en el mismo useEffect
        fetchOrganizerDetails();
        fetchEventDetails();
    }, [event.id, event.id_organizador]); // Dependencias actualizadas


    useEffect(() => {
        const loadUserRoleandEvents = async () => {
            const role = await AsyncStorage.getItem('rol');
            console.log('Rol del usuario:', role); 
            setUserRole(role);
        
            if (role === 'ecobuscador') {
                const token = await AsyncStorage.getItem('userToken');
                fetchUserAssistedEvents(token);
            } else {
                // Limpiar el estado para usuarios no ecobuscadores
                setUserAssistedEvents([]);
            }
        };
        loadUserRoleandEvents();
    }, []);

    const fetchUserAssistedEvents = async (token) => {
        try {
            if (token) {
                const response = await fetch('http://192.168.0.17:5000/get_user_assisted_events', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserAssistedEvents(data.assistedEvents);
                } else {
                    console.error('Error al obtener eventos asistidos');
                }
            }
        } catch (error) {
            console.error('Error al cargar eventos asistidos:', error);
        } finally {
            // Introduce un retraso artificial
            setTimeout(() => {
                setIsLoading(false);
            }, 300); // Retraso de 0.4 segundos
        }
    };

    const isUserRegistered = () => {
        if (!event || !userAssistedEvents) return false;
        console.log('ID del evento actual:', event.id);
        console.log('Eventos asistidos:', userAssistedEvents);
        // Comprobar si el ID del evento está en la lista de eventos asistidos
        return userAssistedEvents.some(eventItem => eventItem === event.id);
    };

    const handleAssist = async () => {
        console.log('Asistencia');
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }
    
            // Llamada al endpoint para registrar asistencia
            const response = await fetch('http://192.168.0.17:5000/assist_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    event_id: event.id,
                }),
            });
    
            if (response.ok) {
                Alert.alert('Éxito', 'Asistencia registrada correctamente');
                console.log('Asistencia registrada correctamente al evento:', event.id);
                
                // Actualiza el estado y luego actualiza AsyncStorage
                setUserAssistedEvents(prevEvents => {
                    const updatedEvents = [...prevEvents, event.id];
                    console.log("Eventos a que el usuario va asistir (updatedEvents): ", updatedEvents);
                    AsyncStorage.setItem('assistedEvents', JSON.stringify(updatedEvents));
                    return updatedEvents;
                });
    
                // Llamada adicional para actualizar el número de confirmados
                const confirmResponse = await fetch(`http://192.168.0.17:5000/event_confirm_count/${event.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (confirmResponse.ok) {
                    const confirmData = await confirmResponse.json();
                    setEvent(prevEvent => ({
                        ...prevEvent,
                        confirmados: confirmData.confirmados
                    }));
                } else {
                    console.error('Error al obtener el número actualizado de confirmados');
                }
            } else {
                Alert.alert('Error', 'Error al registrar la asistencia');
            }
        } catch (error) {
            console.error('Error al registrar la asistencia:', error);
            Alert.alert('Error', error.toString());
        }
    };
    

    // Función para manejar la selección de estrellas en el modal
    const onStarRatingPress = (newRating) => {
        setTempStarCount(newRating); // Esto actualizará el valor temporal mientras el usuario selecciona las estrellas
    };

    // Función que se llama cuando se presiona "Puntuar"
    const openModalToRate = () => {
        setTempStarCount(starCount); // Inicia tempStarCount con el valor actual antes de abrir el modal
        setModalVisible(true);
    };

    const submitRating = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const userId = await AsyncStorage.getItem('userId'); // Recuperar el ID del usuario almacenado
            console.log("USER ID: ", userId);
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }
    
            console.log('Puntuación seleccionada por el usuario:', tempStarCount);
    
            const response = await fetch('http://192.168.0.17:5000/rate_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    event_id: event.id, // Asegúrate de que 'event.id' sea el ID correcto del evento que se va a calificar
                    rating: tempStarCount, // 'tempStarCount' debe ser la calificación seleccionada por el usuario
                    user_id: userId, // Añade el ID del usuario en el cuerpo de la solicitud
                }),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                const userId = await AsyncStorage.getItem('userId');
                console.log('Estrellas Update:', responseData);
                setEvent({ ...event, puntaje: responseData.new_average }); // Actualizar el evento con el nuevo promedio
                const newAverage = parseFloat(responseData.new_average); // Convierte la nueva media a un número si es una cadena
                setStarCount(newAverage); // Actualiza el estado con el nuevo promedio
                await AsyncStorage.setItem(`starCount-${event.id}-${userId}`, newAverage.toString()); // Guarda la calificación del usuario como una cadena
                Alert.alert('Éxito', 'Puntuación actualizada correctamente');
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Error al enviar la puntuación');
            }
        } catch (error) {
            console.error('Error al enviar la puntuación:', error);
            Alert.alert('Error', 'No se pudo conectar al servidor para actualizar la puntuación.');
        }
    
        // Cierra el modal después de intentar enviar la puntuación
        setModalVisible(false);
    };
    


    if (!event) {
        return <Text>Error: Evento no encontrado</Text>;
    }

    const securityLevel = distritosSecurity.find(d => d.DISTRITOS === event.ubicacion)?.['NIVEL DE INSEGURIDAD'] || 'No disponible';
    const numericSecurityLevel = isNaN(securityLevel) ? 0 : parseInt(securityLevel, 10);
    const securityIconColor = getSecurityIconColor(numericSecurityLevel);
    const durationInMinutes = Math.round(parseFloat(event.duracion));
    const Capacidad = Math.round(parseFloat(event.capacidad));

    return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.eventHeader}>
                <Text style={styles.title}>{event.nombre}</Text>
                {userRole === 'ecobuscador' && showLoadingIndicatorOrCheck()}
                {userRole === 'ecobuscador' && shouldShowAssistButton() && (
                    <TouchableOpacity onPress={handleAssist} style={styles.assistButton}>
                        <AntDesign name="pluscircle" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <Image source={{ uri: event.banner }} style={styles.image} />
            <Text style={styles.title}>{event.nombre}</Text>
            <Text style={styles.userId}>Creado por: {organizerName}</Text>
            <Text style={styles.location}>{event.ubicacion}</Text>
            <View style={styles.description}>
            <Text >{event.descripcion}</Text>
            </View>
            <Text style={styles.detail}>{event.descrip_detail}</Text>
            <Text style={styles.tag}>{event.tag}</Text>
            <Text style={styles.capacity}>Capacidad: {Capacidad}</Text>
            <Text style={styles.duration}>Duración: {durationInMinutes}</Text>
            <Text style={styles.date}>{event.fecha}</Text>
            <Text style={styles.time}>{event.hora}</Text>
            <Text style={getStatusStyle(event.status)}>{event.status}</Text>
            {userRole === 'ecoorganizador' && (
                <Text style={styles.confirmed}>Confirmados: {event.confirmados}</Text>
            )}
            <View style={styles.ratingContainer}>
                    <StarDisplay new_average={starCount} />
                    {shouldShowRateButton() && (
                        <TouchableOpacity style={[styles.rateButton]} onPress={openModalToRate}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                                <FontAwesome5 name="star" size={21.6} color="#2268D6" marginRight={5} />
                                <Text style={{ color: '#2268D6', fontSize:17 }}>Puntuar</Text>
                            </View>
                        </TouchableOpacity>
                    )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity 
                          style={styles.closeButton}
                          onPress={() => setModalVisible(false)}
                        >
                        <AntDesign name="closecircle" size={24} color="black" />
                        </TouchableOpacity>
                        <Rating
                            type='star'
                            ratingCount={5}
                            imageSize={40}
                            showRating
                            startingValue={tempStarCount}
                            onFinishRating={onStarRatingPress}
                            fractions={1}
                        />
                        <TouchableOpacity style={styles.openButton} onPress={submitRating}>
                            <Text style={styles.textStyle}>
                                {hasUserRated ? "Actualizar Puntuación" : "Confirmar Puntuación"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <MapView
            style={styles.map}
            region={{
                latitude: parseFloat(event.coordenadas.latitude),
                longitude: parseFloat(event.coordenadas.longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
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
            {userRole === 'ecobuscador' && (
                <TouchableOpacity onPress={handleNavigateToCrimeData}>
                    <Image source={gmaps} style={styles.gmapslogo} />
                </TouchableOpacity>
            )}
            <View style={styles.nuevo}>
            <Button title="Go to UserProfile" onPress={() => navigation.navigate('Profile')} />
            </View>
        </ScrollView>
       </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    gmapslogo:{
        width:30,
        height:30,
        marginTop:-195,
        marginLeft:300,
    },
    statusPorEmpezar: {
        fontSize: 14,
        color: 'green',
        marginTop: 10,
    },
    statusEnProgreso: {
        fontSize: 14,
        color: 'orange',
        marginTop: 10,
    },
    statusFinalizado: {
        fontSize: 14,
        color: 'red',
        marginTop: 10,
    },
    statusDefault: {
        fontSize: 14,
        color: 'black', // Color por defecto
        marginTop: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: '#47897E', //cambio de color "Confirmar" en Puntuar
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 20,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    checkButton: {
        backgroundColor: '#4CAF50',  
        padding: 10,                
        borderRadius: 5,            
        alignItems: 'center',       
        justifyContent: 'center',   
    },
    assistButton: {
        backgroundColor: '#47897E',
        padding: 10,
        borderRadius: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    starDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15, // Ajusta esto según sea necesario
    },
    starIcon: {
        marginRight: 7, // Ajusta el espacio entre la estrella y el texto
    },
    ratingText: {
        fontSize: 22, // Ajusta esto según sea necesario para que coincida con el tamaño de la primera foto
        color: '#333', // Esto hará que el texto sea negro
        marginRight: 2.8, // Pequeño espacio entre la puntuación y el '/ 5'
    },
    ratingOutOf: {
        fontSize: 17.5, // Más pequeño que la puntuación
        color: '#666',
        // Si necesitas ajustar el estilo del '/ 5' por separado, hazlo aquí
    },
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
        marginTop: -3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    location: {
        fontSize: 18,
        marginTop: 8,
    },
    description: {
        fontSize: 16,
        marginTop: 8,
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
        marginTop: -38,
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
        top: 776,
        left: 25,
        zIndex: 1,
    },
    nuevo: {
        marginTop: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // ... otros estilos para el contenedor de puntuación ...
    },
    rateButton: {
        // ... estilos para tu botón de puntuar ...
    },
});

export default Event;
