import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import RedesSocialesIcon from '../../assets/redes-sociales.png';
import localImage from '../../assets/estrella.png';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation



const user = {
  firstName: 'Aaron',
  lastName: 'Coorahua Lindo',
  profileImage: 'https://media.discordapp.net/attachments/1015053042959265802/1159916101736603800/Imagen_de_WhatsApp_2023-10-06_a_las_13.11.52_08cc0798.jpg?ex=6532c30c&is=65204e0c&hm=d7212b0de2b75384be76bec11a3503eca502a30f0ffe6061764919261411d68c&=&width=317&height=423',
  aboutme: 'ABOUT ME:',
  description: '¡Hola! Soy Aaron Coorahua, apasionado por el fútbol ⚽🍫 y amante de las aventuras al aire libre 🌄',
  role: 'Eco-Organizador',
};

const bannerImage = 'https://media.discordapp.net/attachments/1015053042959265802/1159934655043219546/pngtree-hilarious-3d-gorilla-cartoon-pumping-iron-image_3813702.png?ex=6532d454&is=65205f54&hm=764140bfb6a3da54692bda045156ab0831c6bca4b9cd318ffb5bc780fcba9ef3';

const medalla1 = 'https://media.discordapp.net/attachments/1155323431915630594/1160134137886289920/image.png?ex=65338e1c&is=6521191c&hm=c029ab5d594426fbda753bdaf7b8669d969f22fb03ba6e35f91c83a10e390095&=';
const medalla2 = 'https://media.discordapp.net/attachments/1155323431915630594/1160134014980608060/image.png?ex=65338dff&is=652118ff&hm=65fbe72bd8398af6a6d3263525e22b49b7b78fb413ca51a9bd25ba17740823c3&=';

// Lista de intereses
const interes1 = 'https://media.discordapp.net/attachments/952775750728155136/1161435237075656704/montana.png?ex=653849da&is=6525d4da&hm=8780d957d9b6b2bb5289227f94a35776e573703c6c903b901510d69f6c42f7a1&=&width=423&height=423';
const interes2 = 'https://media.discordapp.net/attachments/952775750728155136/1161435260253372507/reciclar-senal.png?ex=653849e0&is=6525d4e0&hm=59e605288ece681af3f60348e92856c8b60585612cc0bf31440de50af6ec3885&=&width=423&height=423';

export default function UserProfileOrg() {
    const navigation = useNavigation(); // Obtiene el objeto de navegación
    const handleCreateEventClick = () => {
          navigation.navigate('CreateEvents');
  }
  return (
    <View style={styles.container}>
      {/* Banner de fondo */}
      <Image source={{ uri: bannerImage }} style={styles.bannerImage} />

      {/* Contenedor para las estrellas (en el lado derecho superior) */}
      <View style={styles.estrellasContainer}>
        <Image source={localImage} style={styles.estrella} />
        <Image source={localImage} style={styles.estrella} />
        <Image source={localImage} style={styles.estrella} />
        {/* Agrega más estrellas según sea necesario */}
      </View>

      <TouchableOpacity
        style={styles.createEventButton}
        onPress={handleCreateEventClick}
      >
        <Text style={styles.createEventButtonText}>Create Event</Text>
      </TouchableOpacity>

      {/* Contenedor para la imagen de perfil */}
      <View style={styles.profileContainer}>
        {/* Imagen de perfil */}
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      </View>

      {/* Contenedor principal de texto */}
      <View style={styles.textContainer}>
        {/* Contenedor de la sección de nombre */}
        <View style={styles.nameContainer}>
          {/* Nombre y apellido */}
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        </View>

        {/* Contenedor del rol */}
        <View style={styles.roleContainer}>
          {/* Rol */}
          <Text style={styles.role}>{user.role}</Text>
        </View>

        {/* Contenedor de la sección "About Me" */}
        <View style={styles.aboutmeContainer}>
          {/* Contenedor para el icono y "About Me" */}
          <View style={styles.aboutmeContent}>
            {/* Icono */}
            <Image source={RedesSocialesIcon} style={styles.icon} />
            {/* "About Me" */}
            <Text style={styles.aboutme}>{user.aboutme}</Text>
          </View>
        </View>

        {/* Contenedor de la descripción */}
        <View style={styles.descriptionContainer}>
          {/* Descripción */}
          <Text style={styles.description}>{user.description}</Text>
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


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    position: 'absolute',
    top: 250,
    left: 20,
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
    color: 'black',
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
    color: 'black',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 9,
    maxWidth: 350,
  },
  description: {
    fontSize: 16,
    color: 'black',
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
    marginTop: 11,
  },
  interesesTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interesesContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  position: 'absolute',
  top: 10, // Ajusta la posición superior para superponer en la parte superior
  right: 5, // Ajusta la posición derecha para superponer en el lado derecho
  flexDirection: 'row', // Alinear las estrellas en una fila
},

  estrella: {
    width: 25, // Ajusta el tamaño de las estrellas según tus preferencias
    height: 25,
    marginRight: 5, // Espacio entre las estrellas
  },
    // Estilos para el botón flotante "Create Event"
  createEventButton: {
    position: 'absolute',
    bottom: 65, // Ajusta la posición inferior según tu preferencia
    backgroundColor: 'green', // Cambia el color del botón según tu paleta de colores
    borderRadius: 30, // Asegúrate de que el botón sea redondo
    paddingHorizontal: 20, // Agrega relleno horizontal para el botón
    paddingVertical: 10, // Agrega relleno vertical para el botón
    justifyContent: 'center', // Centra verticalmente el ícono
    alignItems: 'center', // Centra horizontalmente el ícono
  },
  createEventButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', // Cambia el color del texto del botón según tu diseño
  },
});

