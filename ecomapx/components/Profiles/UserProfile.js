import React from 'react';
import { View, Text, Image, StyleSheet,ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import RedesSocialesIcon from '../../assets/redes-sociales.png';


const user1 = {
  firstName: 'Aaron',
  lastName: 'Coorahua',
  profileImage: 'https://media.discordapp.net/attachments/1015053042959265802/1159916101736603800/Imagen_de_WhatsApp_2023-10-06_a_las_13.11.52_08cc0798.jpg?ex=6532c30c&is=65204e0c&hm=d7212b0de2b75384be76bec11a3503eca502a30f0ffe6061764919261411d68c&=&width=317&height=423',
  aboutme: 'ABOUT ME:',
  description: '¡hola',
  role: 'Eco-Buscador',
};

const bannerImage = 'https://media.discordapp.net/attachments/1015053042959265802/1159934655043219546/pngtree-hilarious-3d-gorilla-cartoon-pumping-iron-image_3813702.png?ex=6532d454&is=65205f54&hm=764140bfb6a3da54692bda045156ab0831c6bca4b9cd318ffb5bc780fcba9ef3';

const medalla1 = 'https://media.discordapp.net/attachments/1155323431915630594/1160134137886289920/image.png?ex=65338e1c&is=6521191c&hm=c029ab5d594426fbda753bdaf7b8669d969f22fb03ba6e35f91c83a10e390095&=';
const medalla2 = 'https://media.discordapp.net/attachments/1155323431915630594/1160134014980608060/image.png?ex=65338dff&is=652118ff&hm=65fbe72bd8398af6a6d3263525e22b49b7b78fb413ca51a9bd25ba17740823c3&=';

// Lista de intereses
const interes1 = 'https://media.discordapp.net/attachments/952775750728155136/1161435237075656704/montana.png?ex=653849da&is=6525d4da&hm=8780d957d9b6b2bb5289227f94a35776e573703c6c903b901510d69f6c42f7a1&=&width=423&height=423';
const interes2 = 'https://media.discordapp.net/attachments/952775750728155136/1161435260253372507/reciclar-senal.png?ex=653849e0&is=6525d4e0&hm=59e605288ece681af3f60348e92856c8b60585612cc0bf31440de50af6ec3885&=&width=423&height=423';

export default function UserProfile() {
  
    const [user, setUser] = useState(null);

    useEffect(() => {
      // Función para recuperar el perfil del usuario
      const fetchUserProfile = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
    
          if (!token) {
            Alert.alert('Error', 'No se encontró el token de autenticación.');
            return;
          }
    
          const response = await fetch('http://192.168.0.17:5000/get_user_profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
    
          // Imprime la respuesta en la consola
          console.log('Perfil del usuario:', data);
    
          if (response.status === 200) {
            setUser(data);
          } else {
            Alert.alert('Error', data.error || 'Error al obtener el perfil de usuario.');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
        }
      };
    
      fetchUserProfile();
    }, []);
        
    /* Luego descomentar, ahorita solo quiero probar si funciona bien el redireccionamiento segun el rol del usuario*/
    if (!user) {
        return <Text></Text>;
    }

    return (
      <ScrollView style={styles.container}>
        {/* Banner de fondo */}
        <Image source={{ uri: bannerImage }} style={styles.bannerImage} />
        
        {/* Contenedor para la imagen de perfil */}
        <View style={styles.profileImageContainer}>
          {/* Imagen de perfil */}
          <Image
            source={{ uri: user.foto }}
            style={styles.profileImage}
          />
        </View>
    
        {/* Contenedor principal de texto */}
        <View style={styles.textContainer}>
          {/* Contenedor de la sección de nombre */}
          <View style={styles.nameContainer}>
            {/* Nombres y apellidos */}
            <Text style={styles.name}>{user.nombres} {user.apellidos}</Text>
          </View>
    
          {/* Contenedor del rol */}
          <View style={styles.roleContainer}>
            {/* Rol */}
            <Text style={styles.role}>
              {user.rol === 'ecobuscador' ? 'Eco-Buscador' : user.rol}
            </Text>
          </View>
          
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
          {/* Título de Medallas */}
          <Text style={styles.medalsTitle}>Medallas:</Text>
          {/* Contenedor de medallas */}
          <View style={styles.medalsContent}>
            {/* Medalla 1 */}
            <View style={styles.medal}>
              <Image source={{ uri: medalla1 }} style={styles.medalImage} />
              <Text style={styles.medalTitle}>Medalla de Oro</Text>
            </View>
            {/* Medalla 2 */}
            <View style={styles.medal}>
              <Image source={{ uri: medalla2 }} style={styles.medalImage} />
              <Text style={styles.medalTitle}>Medalla de Plata</Text>
            </View>
            {/* Agrega más medallas según sea necesario */}
          </View>
        </View>
      </ScrollView>
    );
    
}

const styles = StyleSheet.create({
  profileImageContainer: {
    position: 'absolute',
    left: 10,
    top: 140,
  },
  nuevo:{
    top: 50,
    left: 20,
  },
  nuevo2:{
    top: 50,
    left: 0,
  },
  container: {
    flex: 1,
    //alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  profileContainer: {
    position: 'absolute',
    top: 140,
    left: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgb(57, 168, 88)', // Borde verde claro
    backgroundColor: 'red',
  },
  textContainer: {
    top: 42,
    marginLeft: 20,
    marginRight:15,
  },
  nameContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  roleContainer: {
    backgroundColor: 'rgb(124, 194, 66)',
    borderRadius: 20, // Bordes circulares
    paddingHorizontal: 10,
    marginTop: -4,
    alignSelf: 'flex-start', // Alinea el contenedor al principio
  },
  role: {
    fontSize: 16,
    color: 'white',
  },
  aboutme: {
    fontSize: 17,
    color: 'black',
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
    marginRight: 4, //Espacio entre el icono y el texto
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
    marginTop: 50,
  },
  interesesTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
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
  medalsContainer: {
    marginTop: 11,
  },
  medalsTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
  },
  medalsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medal: {
    alignItems: 'center',
  },
  medalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'gold',
  },
  medalTitle: {
    marginTop: 5,
    fontWeight: 'bold',
    marginLeft:20,
    marginRight: 20,
  },
});

