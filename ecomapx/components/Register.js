import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'; // Importar desde expo-image-picker

const convertImageToBase64 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = () => {
        const base64data = reader.result.split(',')[1];
        resolve(base64data);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // Manejo de errores
    console.error('Error al convertir la imagen a base64:', error);
  }
};


export default function Register({ onSuccessfulRegister }) {
  const [userType, setUserType] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [b_date, setB_date] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [genero, setGenero] = useState('');
  const [foto, setFoto] = useState('');
  const navigation = useNavigation();

  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          setFoto(result.assets[0].uri);
        }
      }
    } else {
      // Manejo de permisos no concedidos
      Alert.alert('Error', 'Se requieren permisos para acceder a la galería de imágenes.');
    }
  };
  const handleRegister = async () => {
    if (!nombre || !apellidos || !b_date || !email || !contrasena || !genero || !userType || !foto) {
      Alert.alert('Error', 'Por favor, rellena todos los campos y selecciona una foto.');
      return;
    }
  
    console.log('Intentando registrar...');
    try {
      // Subir la imagen a un servidor o servicio en la nube y obtener la URL
      const imageUrl = await uploadImageToServer(foto); // Implementa esta función
  
      // Guardar la URL en DynamoDB
      await saveImageUrlToDynamoDB(imageUrl); // Implementa esta función
  
      // Luego, puedes incluir la URL en el objeto formData
      const formData = {
        userType,
        nombre,
        apellidos,
        b_date,
        email,
        contrasena,
        genero,
        foto: imageUrl, // 'foto' ahora contiene la URL de la imagen
      };
  
      const response = await fetch('http://192.168.0.16:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.status === 201) {
        onSuccessfulRegister();
        navigation.navigate('Login');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'Error al registrar.');
      }
    } catch (error) {
      // Manejo de errores
    }
  };
  
  

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logop.png')} style={styles.logo} />
          </View>

          <Text>Nombre</Text>
          <TextInput
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />

          <Text>Apellidos</Text>
          <TextInput
            placeholder="Ingresa tus apellidos"
            value={apellidos}
            onChangeText={setApellidos}
            style={styles.input}
          />

          <Text>Fecha de Nacimiento</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={b_date}
            onChangeText={setB_date}
            style={styles.input}
            onBlur={() => {
              const regex = /^\d{4}-\d{2}-\d{2}$/;
              if (!regex.test(b_date)) {
                Alert.alert('Error', 'Formato de fecha no válido.');
                setB_date('');
              }
            }}
          />
          <Text>Tipo de Usuario</Text>
          <Picker
            selectedValue={userType}
            style={styles.input}
            onValueChange={(itemValue) => setUserType(itemValue)}
          >
            <Picker.Item label="Selecciona un tipo de usuario" value="" />
            <Picker.Item label="Ecobuscador" value="ecobuscador" />
            <Picker.Item label="Ecoorganizador" value="ecoorganizador" />
          </Picker>

          <Text>Email</Text>
          <TextInput
            placeholder="Ingresa tu email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <Text>Contraseña</Text>
          <TextInput
            placeholder="Ingresa una contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            style={styles.input}
            secureTextEntry
          />

          <Text>Género</Text>
          <Picker
            selectedValue={genero}
            style={styles.input}
            onValueChange={(itemValue) => setGenero(itemValue)}
          >
            <Picker.Item label="Selecciona un género" value="" />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Femenino" value="femenino" />
            <Picker.Item label="Otro" value="otro" />
          </Picker>

          <TouchableOpacity onPress={openImagePicker} style={styles.selectPhotoButton}>
            <Text style={styles.selectPhotoButtonText}>Seleccionar Foto</Text>
          </TouchableOpacity>

          <View>
            <Button title="Registrar" onPress={handleRegister} />
            <TouchableOpacity onPress={() => navigation.navigate('Login')}></TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  selectPhotoButton: {
    backgroundColor: 'blue', // Cambia el color de fondo según tus preferencias
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5, // Bordes redondeados
  },
  selectPhotoButtonText: {
    color: 'white', // Color del texto
    textAlign: 'center',
  },
    container: {
      flex: 1,
    },
    scrollViewContent: {
      padding: 20,
      backgroundColor:'#F5F5F5',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      marginBottom: 10,
    },
    logoContainer: {
    alignItems: "center",
    marginTop: 0,
    marginBottom: 1,
    marginTop: -55,
    },
    logo: {
        width: 200,
        height: 200,
        marginTop: 55,
    },

  });