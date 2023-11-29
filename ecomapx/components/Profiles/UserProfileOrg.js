import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator, Alert} from 'react-native';
import RedesSocialesIcon from '../../assets/redes-sociales.png';
import localImage from '../../assets/estrella.png';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { Rating } from 'react-native-ratings';
import AntDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
// Importaciones para Firebase:
import { storage } from '../config/firebaseConfig'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const eventos = [
  { id: '1', nombre: 'Evento 1', imagen: 'https://media.discordapp.net/attachments/952775750728155136/1161508511394566174/image.png?ex=65388e18&is=65261918&hm=ca6ecb69096dbc6aca2b9f1d434147f578b6fd40e92ee36bd68be61ddc649609&=' },
  { id: '2', nombre: 'Evento 2', imagen: 'https://media.discordapp.net/attachments/952775750728155136/1161508626549182534/image.png?ex=65388e34&is=65261934&hm=ee8f2a963e9d37a9f5424c73e17278a0320a49239476245752dd3dd3e04da77d&=&width=297&height=423' },
    { id: '3', nombre: 'Evento 1', imagen: 'https://media.discordapp.net/attachments/952775750728155136/1161508511394566174/image.png?ex=65388e18&is=65261918&hm=ca6ecb69096dbc6aca2b9f1d434147f578b6fd40e92ee36bd68be61ddc649609&=' },
  { id: '4', nombre: 'Evento 2', imagen: 'https://media.discordapp.net/attachments/952775750728155136/1161508626549182534/image.png?ex=65388e34&is=65261934&hm=ee8f2a963e9d37a9f5424c73e17278a0320a49239476245752dd3dd3e04da77d&=&width=297&height=423' },
    { id: '5', nombre: 'Evento 1', imagen: 'https://media.discordapp.net/attachments/952775750728155136/1161508511394566174/image.png?ex=65388e18&is=65261918&hm=ca6ecb69096dbc6aca2b9f1d434147f578b6fd40e92ee36bd68be61ddc649609&=' },
  { id: '6', nombre: 'Evento 2', imagen: 'https://media.discordapp.net/attachments/952775750728155136/1161508626549182534/image.png?ex=65388e34&is=65261934&hm=ee8f2a963e9d37a9f5424c73e17278a0320a49239476245752dd3dd3e04da77d&=&width=297&height=423' },
    { id: '7', nombre: 'Evento 1', imagen: 'https://media.discordapp.net/attachments/952775750728155136/1161508511394566174/image.png?ex=65388e18&is=65261918&hm=ca6ecb69096dbc6aca2b9f1d434147f578b6fd40e92ee36bd68be61ddc649609&=' },
  // Agrega más eventos aquí
];

const user1 = {
  firstName: 'Aaron',
  lastName: 'Coorahua Lindo',
  profileImage: 'https://media.discordapp.net/attachments/1015053042959265802/1159916101736603800/Imagen_de_WhatsApp_2023-10-06_a_las_13.11.52_08cc0798.jpg?ex=6532c30c&is=65204e0c&hm=d7212b0de2b75384be76bec11a3503eca502a30f0ffe6061764919261411d68c&=&width=317&height=423',
  aboutme: 'ABOUT ME:',
  description: 'hola sou arron',
  role: 'Eco-Organizador',
};


const bannerImage = 'https://media.discordapp.net/attachments/1015053042959265802/1159934655043219546/pngtree-hilarious-3d-gorilla-cartoon-pumping-iron-image_3813702.png?ex=6532d454&is=65205f54&hm=764140bfb6a3da54692bda045156ab0831c6bca4b9cd318ffb5bc780fcba9ef3';


//MEDALLAS DEVERITAS:

const ecoPioneroMedal = "https://media.discordapp.net/attachments/1155323431915630594/1176299753630335136/image.png?ex=656e5d83&is=655be883&hm=507c348dca67b1c5d2d7e1553b20d9f690deaaafbdbff45de497419cddf1a072&=";
const cincoEstrellasMedal = "https://media.discordapp.net/attachments/1155323431915630594/1176300149274845305/image.png?ex=656e5de2&is=655be8e2&hm=bf8088f5ad9f9e446e13ead08643e5043e983af23133b3320cddcfbfe977f33b&=";
const diezEventosMedal = "https://media.discordapp.net/attachments/1155323431915630594/1176271498466566174/image.png";
const ecoLiderMedal = "https://media.discordapp.net/attachments/1155323431915630594/1176271548353617990/image.png";


// Lista de intereses
const interes1 = 'https://media.discordapp.net/attachments/952775750728155136/1161435237075656704/montana.png?ex=653849da&is=6525d4da&hm=8780d957d9b6b2bb5289227f94a35776e573703c6c903b901510d69f6c42f7a1&=&width=423&height=423';
const interes2 = 'https://media.discordapp.net/attachments/952775750728155136/1161435260253372507/reciclar-senal.png?ex=653849e0&is=6525d4e0&hm=59e605288ece681af3f60348e92856c8b60585612cc0bf31440de50af6ec3885&=&width=423&height=423';


// Esta es una función para cargar las fuentes
const fetchFonts = () => {
  return Font.loadAsync({
    'Gabarito': require('../../assets/fonts/Gabarito-VariableFont_wght.ttf'),
  });
};

const MedalsDisplay = ({ user, eventsData }) => {
  const showEcoPioneroMedal = user.created_events && user.created_events.length >= 1; //Medalla x crear su primer evento - Funciona :)
  const showCincoEstrellasMedal = user.haAlcanzadoCincoEstrellas; //alcanzo 5 estrellas en su perfil de ecoorganizador (puntaje del ecoorganizador) - Funciona
  const showDiezEventosMedal = user.created_events && user.created_events.length >= 10; //Creo 10 o + eventos - Funciona :)

  // La medalla de EcoLíder requiere verificar el promedio de cada evento y que haya al menos 10 eventos - Funciona :)
  let showEcoLiderMedal = false;
  if (user.created_events && user.created_events.length >= 10) {
    showEcoLiderMedal = eventsData.every(evento => evento.puntaje >= 3 && evento.puntaje <= 5);
  }
  return (
    <>
      {showEcoPioneroMedal && (
        <View style={styles.medal}>
          <Image source={{ uri: ecoPioneroMedal }} style={styles.medalImage} />
          <Text style={styles.medalTitle}>Medalla Ecopionero</Text>
        </View>
      )}
      {showCincoEstrellasMedal && (
        <View style={styles.medal}>
          <Image source={{ uri: cincoEstrellasMedal }} style={styles.medalImage} />
          <Text style={styles.medalTitle}>Medalla 5 estrellas</Text>
        </View>
      )}
      {showDiezEventosMedal && (
        <View style={styles.medal}>
          <Image source={{ uri: diezEventosMedal }} style={styles.medalImage} />
          <Text style={styles.medalTitle}>Medalla 10 Eventos</Text>
        </View>
      )}
      {showEcoLiderMedal && (
        <View style={styles.medal}>
          <Image source={{ uri: ecoLiderMedal }} style={styles.medalImage} />
          <Text style={styles.medalTitle}>Medalla EcoLider</Text>
        </View>
      )}
      {/* Repite la lógica para las otras medallas */}
    </>
  );
};


const updatePhoto = async (userId, userType, newPhotoUrl, token) => {
  try {
    const response = await fetch('http://192.168.0.17:5000/update_photo', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        photo: newPhotoUrl, // La nueva URL de la foto
        userType: userType, // El rol del usuario (ecobuscador o ecoorganizador)
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      Alert.alert('Éxito', 'Foto actualizada correctamente');
      return { success: true, photo: newPhotoUrl };
    } else {
      console.error('Error response:', responseData);
      Alert.alert('Error', responseData.error || 'Error al actualizar la foto');
      return { success: false, error: responseData.error || 'Error desconocido' };
    }
  } catch (error) {
    console.error('Error al actualizar la foto:', error);
    Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
    return { success: false, error: error.toString() };
  }
};

// Este es tu componente de perfil
const ProfileComponent = ({ user }) => {
  // Este estado mantendrá la URL de la foto de perfil actual
  const [profilePhoto, setProfilePhoto] = useState(user.foto);
  const [isUploading, setIsUploading] = useState(false);

  // Este manejador se activará cuando el usuario quiera cambiar su foto de perfil

  const handleEditPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setIsUploading(true); // Indicador de carga
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        const imageName = `profile_${user.id}_${new Date().toISOString()}.jpg`;
        const imageRef = ref(storage, `images/${imageName}`);

        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        console.log("DOWNLOAD",downloadURL);
        setProfilePhoto(downloadURL);
        const token = await AsyncStorage.getItem('userToken');
        // Llama a la función updatePhoto con todos los argumentos necesarios
        const updateResult = await updatePhoto(user.id, user.rol, downloadURL, token);
        console.log('VEAMOS:', updateResult);
        console.log('foto URL:', updateResult.photo);
        if (updateResult.success) {
          //console.log('Perfil actualizado:', updateResult.profile_updated);
          console.log('Perfil actualizado con la nueva foto URL:', updateResult.photo);
        } else {
          throw new Error(updateResult.error || 'Error al actualizar el perfil.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    } finally {
      setIsUploading(false); // Finaliza el indicador de carga
    }
  };

  return (
    <View style={styles.profileContainer}>
    {isUploading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CFD8DC" />
      </View>
    ) : (
      <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
    )}
      <TouchableOpacity style={styles.editIcon} onPress={handleEditPhoto}>
        <FontAwesome5 name="pencil-alt" size={15} color="white" style={styles.iconStyle}/>
      </TouchableOpacity>
    </View>
  );
};


export default function UserProfileOrg() {

  const [user, setUser] = useState(null);
  const [eventos, setEventos] = useState([]);
  const navigation = useNavigation();
  
  const fetchUserProfileAndEvents = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            Alert.alert('Error', 'No se encontró el token de autenticación.');
            return;
          }
    
          // Cargar perfil del usuario
          const userProfileResponse = await fetch('http://192.168.0.17:5000/get_user_profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = await userProfileResponse.json();

          // Imprime la respuesta en la consola
          console.log('Perfil del usuario:', userData);
          
          if (userProfileResponse.status === 200) {
            setUser(userData);
             // Si es un ecoorganizador, carga su calificación promedio
                if (userData.rol === 'ecoorganizador') {
                  const ratingResponse = await fetch(`http://192.168.0.17:5000/get_organizer_rating/${userData.id}`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                  });
                  const ratingData = await ratingResponse.json();
                  if (ratingResponse.ok) {
                    console.log('Calificación promedio del organizador:', ratingData.promedio);
                    // Aquí puedes actualizar el estado o UI con el promedio
                  } else {
                    Alert.alert('Error', ratingData.error || 'Error al obtener la calificación del organizador.');
                  }
                }
              } else {
                Alert.alert('Error', userData.error || 'Error al obtener el perfil de usuario.');
                return;
              }

          // Cargar eventos
          const eventsResponse = await fetch('http://192.168.0.17:5000/get_events_by_organizer', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const eventsData = await eventsResponse.json();

          // Imprime la respuesta en la consola
          console.log('Eventos del Organizador:', eventsData);

          if (eventsResponse.status === 200) {
            setEventos(eventsData);
          } else {
            Alert.alert('Error', eventsData.error || 'Error al obtener los eventos.');
          }
    
        } catch (error) {
          console.error('Error:', error);
          Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
        }
  };

  useFocusEffect(
    useCallback(() => {
        // Llama a la función para recuperar la información cada vez que la pantalla entra en foco
        fetchUserProfileAndEvents();

        // No es necesario un return aquí, ya que no estamos desuscribiendo de ningún evento
    }, [])
  );

  const handleLogout = async () => {
    try {
      // Elimina el token de AsyncStorage para cerrar la sesión
      await AsyncStorage.removeItem('userToken');
      // Registra un mensaje en la consola cuando el usuario cierra sesión
      console.log('Usuario cerró sesión exitosamente');
      // Redirige al usuario a la pantalla de inicio de sesión
      navigation.navigate('Login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    // Previene la auto-ocultación de SplashScreen al inicio
    SplashScreen.preventAutoHideAsync();

    const prepare = async () => {
      try {
        // Carga las fuentes y cualquier otro recurso aquí
        await fetchFonts();
      } catch (e) {
        console.warn('Error al cargar los recursos:', e);
      } finally {
        // Oculta la pantalla de carga independientemente del resultado
        SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);
        
    /* Luego descomentar, ahorita solo quiero probar si funciona bien el redireccionamiento segun el rol del usuario*/
    if (!user) {
        return <Text></Text>;
    }
  /*
  const navigation = useNavigation(); // Obtiene el objeto de navegación
  const handleCreateEventClick = () => {
    navigation.navigate('CreateEvents');
  }
  */
 console.log("PROMEDIO DEL ORGANIZADOR: ", user.promedio); //ASI ACCEDO AL PROMEDIO (LO PROBE Y FUNCIONA ME TIRA 3.8 nasheee)

  return (
    <ScrollView style={styles.container}>

      {/* Banner de fondo */}
      <Image source={{ uri: bannerImage }} style={styles.bannerImage} />

      {/* Contenedor para la imagen de perfil */}
      <ProfileComponent user={user} />

      {/* Contenedor principal de texto */}
      <View style={styles.nuevo}>
        {/* Contenedor de la sección de nombre */}
        <View style={styles.nameContainer}>
          {/* Nombre y apellido */}
          <Text style={styles.name}>{user.nombres} {user.apellidos}</Text>
        </View>

        {/* Contenedor del rol */}
        <View style={styles.roleContainer}>
          {/* Rol */}
          <Text style={styles.role}>
          {user.rol === 'ecoorganizador' ? 'Eco-Organizador' : user.rol}
          </Text>
        </View>

        {/* Contenedor de las estrella */}
        <View style={styles.estrellasContainer}>
        <AntDesign name="star-circle" size={25} color="gold" style={styles.estrellaIcon}/>
        <Text style={styles.text_prom}> {user.promedio}</Text>
        </View>
      </View>

        <View style={styles.textContainer}>
        {/* Contenedor de la sección "About Me" */}
        <View style={styles.aboutmeContainer}>
          {/* Contenedor para el icono y "About Me" */}
          <View style={styles.aboutmeContent}>
            {/* Icono */}
            <Image source={RedesSocialesIcon} style={styles.icon} />
            {/* "About Me" */}
            <Text style={styles.aboutme}>{user1.aboutme}</Text>
          </View>
        </View>

        {/* Contenedor de la descripción */}
        <View style={styles.descriptionContainer}>
          {/* Descripción */}
          <Text style={styles.description}>{user.descripcion}</Text>
        </View>
        </View>


{/* Contenedor de la sección de Intereses */}
<View style={styles.interesesContainer}>
  {/* Título de Intereses */}
  <Text style={styles.interesesTitle}>Intereses:</Text>
  {/* Contenedor de intereses */}
  <View style={styles.interesesContent}>
    {/* Interés 1 */}
    <View style={styles.interes}>
      <View style={styles.interesIconContainer}>
        <Image source={{ uri: interes1 }} style={styles.interesIcon} />
      </View>
      <Text style={styles.interesTitle}>Actividades al Aire</Text>
    </View>

    {/* Interés 2 */}
    <View style={styles.interes}>
      <View style={styles.interesIconContainer}>
        <Image source={{ uri: interes2 }} style={styles.interesIcon} />
      </View>
      <Text style={styles.interesTitle}>Reciclaje</Text>
    </View>
    {/* Agrega más intereses según sea necesario */}
  </View>
</View>


    {/* Contenedor de la sección de medallas */}
    <View style={styles.medalsContainer}>
      <Text style={styles.medalsTitle}>Medallas:</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.medalsContent}>
        {/* Aquí usas MedalsDisplay pasando el usuario */}
        <MedalsDisplay user={user} eventsData={eventos} />
      </ScrollView>
    </View>

        {/* Sección: "Mis Eventos" */}
        <View style={styles.misEventosContainer}>
          <Text style={styles.misEventosTitle}>Mis Eventos:</Text>
          <FlatList
            data={eventos}
            horizontal={true} // Deslizamiento horizontal
            showsHorizontalScrollIndicator={false} // Ocultar la barra de desplazamiento
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.eventoContainer}>
                <Image source={{ uri: item.banner }} style={styles.eventoImage} />
                <Text style={styles.eventoNombre}>{item.nombre}</Text>
              </View>
            )}
          />
        </View>

        {/*Container Logout*/}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="logout" size={20} color='rgb(80, 140, 100)' />
              </View>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  logoutContainer: {
    width: '100%', // Ocupa todo el ancho disponible
    alignItems: 'center', // Alinea los elementos internos al centro horizontalmente
    justifyContent: 'flex-end', // Alinea el botón de logout al final del contenedor verticalmente
    padding: 10, // Espacio alrededor del botón para evitar que se pegue a los bordes
    paddingVertical:28,
    marginTop:-9,
  },
  logoutButton: {
    flexDirection: 'row', // Icono y texto en fila
    alignItems: 'center', // Alineación vertical
    backgroundColor: "rgb(124, 194, 66)",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCircle: {
    width: 30, // Tamaño del círculo
    height: 30, // Tamaño del círculo
    borderRadius: 10, // La mitad del tamaño para que sea un círculo
    borderColor: 'rgb(80, 140, 100)', // Color del borde
    borderWidth: 2, // Grosor del borde
    justifyContent: 'center', // Centrar ícono verticalmente
    alignItems: 'center', // Centrar ícono horizontalmente
    marginRight: 7, // Espacio entre el ícono y el texto
  },
  logoutText: {
    color: 'rgb(80, 140, 100)', // Color del texto
    fontSize: 19, // Tamaño del texto
    fontFamily: 'Gabarito', // Asegúrate de que la fuente está cargada
    fontWeight: 'bold',
  },

  medalsContainer: {
    marginTop: 5,
    //backgroundColor: 'pink',

  },
  medalsTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    color: '#333',
  },
  medalsContent: {
    //flexDirection: 'row',
    //justifyContent: 'space-between',

  },
  medal: {
    alignItems: 'center',
  },
  medalImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2,
    borderColor: 'gold',
  },
  medalTitle: {
    marginTop: 5,
    fontWeight: 'bold',
    marginLeft:20,
    marginRight: 20,
  },
  /*Cambie*/
  editIcon: {
    // Estilos para el botón que contiene el icono
    position: 'absolute', // Puedes ajustar la posición según necesites
    right: 5,
    bottom: 5,
    backgroundColor: 'rgb(80, 140, 100)', // Color de fondo del círculo
    borderRadius: 15, // La mitad del ancho y alto para hacerlo circular
    width: 30, // Ancho del círculo
    height: 30, // Alto del círculo
    justifyContent: 'center', // Centra el icono horizontalmente
    alignItems: 'center', // Centra el icono verticalmente
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  iconStyle: {
    // Estilos para el icono en sí
  },
  loadingContainer: {
    width: 124, // Cambia el ancho de la imagen
    height: 126, // Cambia la altura de la imagen
    borderRadius: 63, // Asegúrate de que el radio de borde sea la mitad del ancho/altura
    backgroundColor: 'rgb(57, 168, 88)', // Un color de fondo para el círculo
    justifyContent: 'center', // Centra el indicador verticalmente
    alignItems: 'center', // Centra el indicador horizontalmente
  },
  text_prom:{
    fontWeight:'bold',
    fontSize: 18,
  },
  nuevo:{

    top: 50,
    left: 0,
  },
  container: {
    flex: 1,

  },
  bannerImage: {
    width: '100%',
    height: 200,

  },
profileContainer: {
  position: 'absolute',
  top: 120,
  alignSelf: 'center',
  justifyContent: 'center',
  width: 130, // Cambia el ancho del contenedor
  height: 130, // Cambia la altura del contenedor
  borderRadius: 130, // Asegúrate de que el radio de borde sea igual al ancho/altura
  borderWidth: 3, // Aumenta el ancho del borde
  borderColor: 'rgb(57, 168, 88)',
},
profileImage: {
  width: 126, // Cambia el ancho de la imagen
  height: 126, // Cambia la altura de la imagen
  borderRadius: 63, // Asegúrate de que el radio de borde sea la mitad del ancho/altura
  alignSelf: 'center',
  justifyContent: 'center',

},

  textContainer: {
    top: 50,
    marginLeft: 20,
    marginRight:15,
  },
  nameContainer: {
    marginBottom: 10,
    marginTop: 2,
      alignSelf: 'center', // Alinea el contenedor al centro
  justifyContent: 'center', // Centra horizontalmente
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
roleContainer: {
  backgroundColor: 'rgb(80, 140, 100)',
  borderRadius: 20,
  paddingHorizontal: 10,
  marginTop: -4,
  alignSelf: 'center', // Alinea el contenedor al centro
  justifyContent: 'center', // Centra horizontalmente
},

  role: {
    fontSize: 16,
    color: 'white',
  },
  aboutme: {
    fontSize: 17,
    color: '#333',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 9,
    maxWidth: 350,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: 'black',
    flexShrink: 1,
  },
  icon: {
    width: 24, //Ancho del icono
    height: 24, //Alto del icono
    marginRight: 7, //Espacio entre el icono y el texto
    marginTop: 7,
  },
  aboutmeContainer: {
    marginTop: 5,
  },
  aboutmeContent: {
    flexDirection: 'row', //Coloca los elementos en la misma línea
    alignItems: 'center', //Alinea verticalmente los elementos al centro
  },
  interesesContainer: {
    marginTop: 60,
  },
  interesesTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 20,
    color: '#333',
  },
  interesesContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginRight:20,
    marginLeft:20,

  },
  //este es el que contiene tanto al Icono y el Titulo del Interes
interes: {
  alignItems: 'center',
  width: '30%',
  marginBottom: 10,
  borderRadius: 10,
  backgroundColor: '#7FCCEB',
},

  //este es del Icono nomas
  interesIconContainer: {
    width: 80, // Ancho del contenedor del ícono
    height: 80, // Alto del contenedor del ícono
    borderRadius: 10, // Borde de estilo squircle para el contenedor del ícono
    //borderWidth: 2, // Ancho del borde del contenedor del ícono
    //borderColor: 'gold', // Color del borde del contenedor del ícono
    justifyContent: 'center', // Centra verticalmente el ícono
    alignItems: 'center', // Centra horizontalmente el ícono
  },
  //este espeficamente de la imagen del icono
  interesIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  interesTitle: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  estrellasContainer: {
    flexDirection: 'row',
    marginTop: 7,
    alignSelf: 'center',
    alignItems: 'center', // Asegura la alineación vertical
    marginLeft: -5,
  },
  estrellaIcon: {
    marginRight: 1, // Espacio entre la estrella y el texto
    marginTop: 3.4,
  },
  text_prom: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333', // Cambia al color que prefieras
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra ligera para el texto
    textShadowRadius: 0.5,
    marginTop: 1,
  },
  // Estilos para la sección "Mis Eventos"
misEventosContainer: {
  marginVertical: 10,
  paddingLeft: 10,
  paddingRight: 0,
},

 misEventosTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    marginBottom: 12,
  },
eventoContainer: {
  marginLeft: 10,
  marginHorizontal: 5, // Espaciado horizontal reducido para evitar demasiado espacio entre tarjetas
  width: 160, // Ancho ligeramente reducido
  borderRadius: 15, // Esquinas más redondeadas
  borderWidth: 0.4,
  borderColor: '#ccc',
  shadowColor: '#000', // Sombra negra
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3, // Elevación para Android para efecto de sombra
  overflow: 'hidden', // Mantiene las imágenes dentro de las esquinas redondeadas
},

eventoImage: {
  width: '100%',
  height: 120, // Altura ajustada para mantener la relación de aspecto
  resizeMode: 'cover', // Asegura que la imagen cubra el área sin distorsión
},

eventoNombre: {
  padding: 8, // Padding reducido para más espacio de imagen
  fontSize: 14, // Tamaño de fuente ligeramente reducido
  fontWeight: '500', // Menos pesado que 'bold'
  textAlign: 'center',
  color: 'black', // Color ligeramente más suave que el negro
 },
});

