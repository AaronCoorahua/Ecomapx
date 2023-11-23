import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, KeyboardAvoidingView, Alert, Modal,TouchableOpacity,  ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import distritosSecurity from '../../data/distritos.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Rating, AirbnbRating } from 'react-native-ratings';
import {FontAwesome} from '@expo/vector-icons';


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

const Event = ({ route }) => {
    const navigation = useNavigation();
    const { event } = route.params;
   
    // Estados para controlar la puntuación y la visibilidad del modal
    // Asegúrate de que starCount se inicializa como un número
    const [starCount, setStarCount] = useState(parseFloat(event.puntaje)); // Puntuación actual
    const [tempStarCount, setTempStarCount] = useState(starCount); // Puntuación temporal para el modal
    const [modalVisible, setModalVisible] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userAssistedEvents, setUserAssistedEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
 

    useEffect(() => {
        // Cargar la puntuación guardada al iniciar el componente
        const loadStarCount = async () => {
            const savedStarCount = await AsyncStorage.getItem('starCount-' + event.id);
            if (savedStarCount !== null) {
                setStarCount(parseFloat(savedStarCount));
            } else {
                // Si no hay una puntuación guardada, usa la puntuación inicial del evento
                setStarCount(parseFloat(event.puntaje));
            }
        };

        const loadUserRole = async () => {
            const role = await AsyncStorage.getItem('rol');
            console.log('Rol del usuario:', role); 
            setUserRole(role);
        
            if (role === 'ecobuscador') {
                fetchUserAssistedEvents();
            }
        };
        loadStarCount();
        loadUserRole()

    }, [event.id, event.puntaje]); // Dependencias del efecto

    console.log('starCount:', starCount);

    const fetchUserAssistedEvents = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const response = await fetch('http://192.168.3.4:5000/get_user_assisted_events', {
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
            setIsLoading(false);  // Finaliza la carga una vez que se obtienen los datos
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
        console.log('Asistencia')
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }
            const response = await fetch('http://192.168.3.4:5000/assist_event', {
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
                    const updatedEvents = [...prevEvents, event.id]; // Asegúrate de que sea solo el ID si así lo manejas
                    AsyncStorage.setItem('assistedEvents', JSON.stringify(updatedEvents));
                    return updatedEvents;
                });
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

    // Función para actualizar el promedio del ecoorganizador
    const updateOrganizerAverage = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            Alert.alert('Error', 'No se encontró el token de autenticación.');
            return;
          }
          
          const response = await fetch('http://192.168.0.4:5000/update_organizer_average', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            // No es necesario enviar un cuerpo (body) si el cálculo se realiza en el backend
          });
  
          const responseData = await response.json();
  
          if (response.ok) {
            // Actualiza el estado o UI si es necesario
            Alert.alert('Éxito', 'Promedio actualizado correctamente.');
          } else {
            Alert.alert('Error', responseData.error || 'Error al actualizar el promedio.');
          }
        } catch (error) {
          console.error('Error al actualizar el promedio:', error);
          Alert.alert('Error', 'No se pudo conectar al servidor para actualizar el promedio.');
        }
    };

    const submitRating = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }
    
            console.log('Puntuación seleccionada por el usuario:', tempStarCount);
    
            const response = await fetch('http://192.168.0.4:5000/rate_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    event_id: event.id,
                    rating: tempStarCount,
                }),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log('Estrellas Update:', responseData);
                const newAverage = parseFloat(responseData.new_average); // Convierte la nueva media a un número si es una cadena
                setStarCount(newAverage); // Actualiza el estado con el nuevo promedio
                await AsyncStorage.setItem(`starCount-${event.id}`, newAverage.toString()); // Guarda el nuevo promedio como una cadena
                Alert.alert('Éxito', 'Puntuación actualizada correctamente');
                // Ahora llama a la función para actualizar el promedio del ecoorganizador
                await updateOrganizerAverage(); // Esta función se debe definir o importar en Event.js
            } else {
                // Si la respuesta no fue exitosa, maneja el error
                Alert.alert('Error al enviar la puntuación');
            }
        } catch (error) {
            // Si hubo un error en la solicitud o al procesar la respuesta
            console.error('Error al enviar la puntuación:', error);
            Alert.alert('Error', error.toString());
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
                {userRole === 'ecobuscador' && (isLoading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                ) : isUserRegistered() ? (
                    <View style={styles.checkButton}>
                        <FontAwesome5 name="check" size={24} color="black" />
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleAssist} style={styles.assistButton}>
                        <AntDesign name="pluscircle" size={24} color="black" />
                    </TouchableOpacity>
                ))}
            </View>
            <Image source={{ uri: event.banner }} style={styles.image} />
            <Text style={styles.title}>{event.nombre}</Text>
            <Text style={styles.userId}>Creado por: {event.id_organizador}</Text>
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
            <Text style={styles.status}>{event.status}</Text>
            <Text style={styles.review}>Reseñas: {event.resenas}</Text>
            <Text style={styles.confirmed}>Confirmados: {event.confirmados}</Text>
            <View style={styles.ratingContainer}>
                <StarDisplay new_average={starCount} />
                <TouchableOpacity style={[styles.rateButton]} onPress={openModalToRate}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14}}>
                <FontAwesome5 name="star" size={21.6} color="#2268D6" marginRight={5}/>
                <Text style={{ color: '#2268D6', fontSize:17}}>Puntuar</Text>
                </View>
                </TouchableOpacity>
               
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
                            <Text style={styles.textStyle}>Confirmar Puntuación</Text>
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
            <View style={styles.nuevo}>
            <Button title="Go to UserProfile" onPress={() => navigation.navigate('Profile')} />
            </View>
        </ScrollView>
       </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
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
        top: 800,
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
