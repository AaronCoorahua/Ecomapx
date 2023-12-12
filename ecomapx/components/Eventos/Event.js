import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Text, Image, StyleSheet, ScrollView, Button, KeyboardAvoidingView, Alert, Modal,TouchableOpacity,  ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import distritosSecurity from '../../data/distritos.json';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Rating, AirbnbRating } from 'react-native-ratings';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
// Importando el Logo de Google Maps:
import gmaps from '../../assets/logo-gmaps.png'; 
import ComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
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

const ReviewList = ({ reviews }) => {
    if (reviews.length === 0) {
        return <Text style={styles.noReviewsText}>Sin comentarios</Text>;
    }

    return (
        <View>
            {reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                    <Text style={styles.reviewText}>Usuario: {review.user_id || 'Usuario Desconocido'}</Text>
                    <Text style={styles.reviewText}>Comentario: {review.review || 'Sin comentario'}</Text>
                </View>
            ))}
        </View>
    );
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
    const [following, setFollowing] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState(event.resenas || []);
    const [isFollowingStatusLoading, setIsFollowingStatusLoading] = useState(true);

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

    const toggleFollowing = async () => {
        const userId = await AsyncStorage.getItem('userId'); // Obtiene el ID del usuario
        const token = await AsyncStorage.getItem('userToken'); // Obtiene el token de autenticación
        const currentlyFollowing = following; // Guarda el estado actual de 'following'
        const action = currentlyFollowing ? 'unfollow' : 'follow'; // Determina la acción basada en el estado actual
    
        try {
            // Envía la solicitud para actualizar la lista de seguimiento del usuario
            const followingUrl = `http://192.168.0.17:5000/update_following/${userId}`;
            await fetch(followingUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organizer_id: event.id_organizador,
                    action: action
                }),
            });
    
            // Envía la solicitud para actualizar el contador de seguidores del ecoorganizador
            const followersUrl = `http://192.168.0.17:5000/update_followers/${event.id_organizador}`;
            await fetch(followersUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: action }),
            });
    
            // Actualizar AsyncStorage para reflejar el cambio de estado
            const key = `following_${userId}_${event.id_organizador}`;
            if (action === 'follow') {
                await AsyncStorage.setItem(key, 'true');
            } else {
                await AsyncStorage.removeItem(key);
            }
    
            // Actualizar el estado de seguimiento
            setFollowing(!currentlyFollowing);
    
        } catch (error) {
            console.error('Error al procesar la acción de seguimiento', error);
            // Si hubo un error, revierte el estado de 'following'
            setFollowing(currentlyFollowing);
        }
    };
    
    const buttonStyle = following ? styles.buttonSiguiendo : styles.buttonSeguir;
    const buttonText = following ? 'Siguiendo' : 'Seguir';
    const textStyle = following ? styles.buttonTextSiguiendo : styles.buttonTextSeguir;

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


    // Cargar el estado de seguimiento cuando el componente se monta
    useEffect(() => {
        const loadFollowingStatus = async () => {
            const userId = await AsyncStorage.getItem('userId');
            const key = `following_${userId}_${event.id_organizador}`;
            const followingStatus = await AsyncStorage.getItem(key);
            setFollowing(!!followingStatus);
            setIsFollowingStatusLoading(false);
        };
    
        loadFollowingStatus();
    }, [event.id_organizador]);
    

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

    const handleAddReview = async () => {
        if (!reviewText.trim()) {
            Alert.alert('Error', 'Por favor, escribe una reseña.');
            return;
        }
    
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch('http://192.168.0.17:5000/add_review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    event_id: event.id,
                    review: reviewText
                })
            });
    
            if (response.ok) {
                const data = await response.json();
                const newReview = { user_id: data.user_id, review: reviewText };
    
                // Actualiza el estado de las reseñas y también el estado del evento.
                setReviews(prevReviews => [...prevReviews, newReview]);
                setEvent(prevEvent => ({
                    ...prevEvent,
                    resenas: [...prevEvent.resenas, newReview]
                }));
    
                setReviewText('');
                Alert.alert('Éxito', 'Reseña agregada correctamente');
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'No se pudo agregar la reseña');
            }
        } catch (error) {
            console.error('Error al agregar reseña:', error);
            Alert.alert('Error', 'Error al agregar la reseña');
        }
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
            <View style={styles.creadopor}>
            <Text style={styles.userId}>Creado por</Text>
            <Text style={styles.dospuntos}>:</Text>
            </View>
            <View style={styles.userInfoContainer}>
            <Text style={userRole === 'ecoorganizador' ? styles.userId3 : styles.userId2}>
                {organizerName}
            </Text>
                {userRole === 'ecobuscador' && (
                    // Renderiza el botón solo si el estado ha terminado de cargar
                    !isFollowingStatusLoading && (
                        <TouchableOpacity
                            style={[buttonStyle]}
                            onPress={toggleFollowing}
                        >
                            <Text style={textStyle}>{buttonText}</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
            <View style={styles.dashedSeparator3} />
            <View style={styles.locationContainer}>
                    <FontistoIcon name="map-marker-alt" size={20} marginTop={0} marginRight={8} marginLeft={4} color="#000" />
                    <Text style={styles.location}>{event.ubicacion}</Text>
            </View>
            <View style={styles.dashedSeparator} />
            <View style={styles.descriptionContainer}>
                    <ComunityIcon name="text" size={23} marginTop={8} marginRight={5} color="#000" /> 
                    <Text style={styles.description}>{event.descripcion}</Text>
            </View>
            <View style={styles.dashedSeparator} />
            <Text style={styles.detail}>{event.descrip_detail}</Text>
            <Text style={styles.tag}>{event.tag}</Text>
            <View style={styles.capacityContainer}>
                    <FontAwesome name="group" size={23} marginTop={-38} marginRight={5} color="#000" /> 
                    <Text style={styles.capacity}>Capacidad: {Capacidad} personas</Text>
            </View>
            <View style={styles.dashedSeparator2} />
            <View style={styles.duracionContainer}>
                    <Entypo name="stopwatch" size={23} marginTop={17} marginRight={8} color="#000" /> 
                    <Text style={styles.duration}>Duración: {durationInMinutes} minutos</Text>
            </View>
            <View style={styles.dashedSeparator} />
            <View style={styles.dateContainer}>
                        <FontAwesome name="calendar" size={19} marginTop={12} paddingHorizontal={3} marginRight={7} color="#000" />
                        <Text style={styles.date}>{event.fecha}</Text>
            </View>
            <View style={styles.dashedSeparator} />
            <View style={styles.timeContainer}>
                            <AntDesign name="clockcircle" size={19} marginTop={13} paddingHorizontal={3} marginRight={6} color="#000" />
                            <Text style={styles.time}>{event.hora}</Text>
            </View>
            <View style={styles.dashedSeparator} />
            <View style={styles.statusContainer}>
                            <ComunityIcon name="list-status" size={26} marginTop={8} marginLeft={2} marginRight={6} color="#000" />
                            <Text style={getStatusStyle(event.status)}>{event.status}</Text>
            </View>
            <View style={styles.dashedSeparator} />
            {userRole === 'ecoorganizador' && (
                <View style={styles.confirmadosContainer}>
                <FontAwesome5 name="handshake" size={23} marginTop={9} marginLeft={2} marginRight={3} color="#000" />
                <Text style={styles.confirmed}>Confirmados: </Text> 
                <Text style={styles.confirmed2}>{event.confirmados}</Text>
                </View>
            )}
            <View style={styles.dashedSeparator} />
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
            <View style={styles.addReviewContainer}>
                <TextInput
                    style={styles.reviewInput}
                    onChangeText={text => setReviewText(text)}
                    value={reviewText}
                    placeholder="Escribe tu comentario..."
                />
                <Button title="Enviar" onPress={handleAddReview} />
            </View>
            <ReviewList reviews={event.resenas || []} />
        </ScrollView>
       </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    confirmadosContainer:{
        flexDirection: 'row',
    },
    statusContainer:{
        flexDirection: 'row',
    },
    timeContainer:{
        flexDirection: 'row',
    },
    dateContainer:{
        flexDirection: 'row', // Alinea los elementos en una fila horizontal
    },
    duracionContainer:{
        flexDirection: 'row', // Alinea los elementos en una fila horizontal
        marginTop:-10,
    },
    capacityContainer:{
        flexDirection: 'row', // Alinea los elementos en una fila horizontal
    },
    descriptionContainer:{
        flexDirection: 'row', // Alinea los elementos en una fila horizontal
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        marginRight: 20,
    },
    dashedSeparator: {
        height: 1,
        width: "100%",
        backgroundColor: "transparent",
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: -5,
        marginTop: 5,
    },
    dashedSeparator2: {
        height: 1,
        width: "100%",
        backgroundColor: "transparent",
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: -10,
    },
    dashedSeparator3: {
        height: 1,
        width: "100%",
        backgroundColor: "transparent",
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 10,
    },
    
    locationContainer:{
        marginTop: 8,
        flexDirection: 'row', // Alinea los elementos en una fila horizontal
    },
    gmapslogo:{
        width:30,
        height:30,
        marginTop:-195,
        marginLeft:300,
    },
    statusPorEmpezar: {
        fontSize: 14,
        color: 'green',
        marginTop: 13,
    },
    statusEnProgreso: {
        fontSize: 14,
        color: 'orange',
        marginTop: 13,
    },
    statusFinalizado: {
        fontSize: 14,
        color: 'red',
        marginTop: 13,
    },
    statusDefault: {
        fontSize: 14,
        color: 'black', // Color por defecto
        marginTop: 13,
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
        borderRadius: 16,
    },
    userInfoContainer: {
        flexDirection: 'row', // Alinea los elementos en una fila horizontal
        alignItems: 'center', // Centra verticalmente los elementos
        marginTop: -8,
    },
    userId: {
        fontSize: 14,
        color: 'grey',
        marginTop: -3,
        marginRight: 3,
    },
    dospuntos:{
        fontSize: 14,
        color: 'grey',
        marginTop: -3,
    },
    creadopor:{
        flexDirection: 'row', // Alinea los elementos en una fila horizontal
    },
    userId2: {
        marginTop: 8,
        fontSize: 14,
        color: 'grey',
        marginRight: 12, // Agrega margen entre los elementos
    },
    userId3: {
        marginTop: 13,
        fontSize: 14,
        color: 'grey',
        marginRight: 12, // Agrega margen entre los elementos
    },
    buttonSeguir: {
        backgroundColor: '#3498db',
        padding: 9,
        borderRadius: 8,
        marginTop: 8,
    },
    buttonSiguiendo: {
        borderColor:'#3498db',
        borderWidth: 2.5,
        padding: 7.5,
        borderRadius: 8,
        marginTop: 8,
    },
    buttonTextSeguir: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextSiguiendo: {
        color: '#3498db',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    location: {
        fontSize: 18,
        marginTop: -1,
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
        marginTop: 18,
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
    confirmed2: {
        fontSize: 16,
        marginTop: 11,
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 20,
    },
    securityIcon: {
        position: 'absolute',
        top: 822,
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
        marginBottom: -7,
        // ... otros estilos para el contenedor de puntuación ...
    },
    rateButton: {
        // ... estilos para tu botón de puntuar ...
    },
    noReviewsText: {
        fontSize: 16,
        color: 'grey',
        textAlign: 'center',
        marginTop: 5,
    },
    reviewItem: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginTop: 10,
    },
    reviewText: {
        fontSize: 14,
        color: 'black',
    },
    addReviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
    },
    reviewInput: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
});

export default Event;
