import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import {iconOffset} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFonts} from 'expo-font';
import {useCallback} from 'react';


export default function Login({ onSuccessfulLogin }) {
  const [email, setEmail] = useState(''); //Estado para el nombre de usuario
  const [contrasena, setContrasena] = useState(''); //Estado para la contraseña
  const [userType, setUserType] = useState('');  //'ecobuscador' or 'ecoorganizador'
  const navigation = useNavigation();

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setContrasena(text);
  };
  const handleLogin = async () => {
    console.log('Intentando iniciar sesión...');
    if (!email || !contrasena || !userType) {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.16:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_type: userType,
          email: email,
          contrasena: contrasena
        })
      });

      const data = await response.json();

      if (response.status === 200) {
        if (data.message === 'Logged in successfully') {
          console.log('Inicio de sesión exitoso. Navegando a Posts...');
          await AsyncStorage.setItem('userToken', data.token);
          //onSuccessfulLogin();
          await AsyncStorage.setItem('rol', userType);
          navigation.navigate('MainTabs')
        } else {
          Alert.alert('Error', data.error || 'Error al iniciar sesión.');
        }
      }
    } catch (error) {
      // Si hay algún error en el proceso de fetch, lo mostramos
      Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
    }
  };

  const [fontsLoaded, fontsError] = useFonts({
    Ultra: require("../assets/fonts/Ultra-Regular.ttf"),
    Caprasimo: require("../assets/fonts/Caprasimo-Regular.ttf"),
  });

  if (fontsError) {
      console.error("Error loading fonts: ", fontsError);
      return <Text>Error loading fonts</Text>;
  }

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
        await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView contentContainerStyle={styles.all}>
    <View style={styles.backgroundImage}>
 
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innercontainer}>
              <View style={styles.logoContainer}>
                <Image source={require('../assets/logop.png')} style={styles.logo} />
              </View>
              <View style={styles.titleContainer}>

              </View>
              <View style={styles.nuevo}>
              <View style={styles.textInputContainer}>
                    <Icon name="user" size={20} color="#47897E" style={styles.iconStyle}/>
                    <TextInput
                        placeholder="Email"
                        style={styles.inputWithIcon}
                        value={email}
                        onChangeText={handleEmailChange}
                    />
                </View>

                <View style={styles.textInputContainer_}>
                  <Icon name="lock" size={20} color="#47897E" style={styles.iconStyle}/>
                    <TextInput
                        placeholder="Password"
                        style={styles.inputWithIcon}
                        value={contrasena}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.roleButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  userType === 'ecobuscador' && styles.selectedRoleButton,
                ]}
                onPress={() => setUserType('ecobuscador')}
              >
                <Text style={[styles.roleButtonText, userType === 'ecobuscador' && styles.selectedRoleButtonText]}>
                  Eco Buscador
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  userType === 'ecoorganizador' && styles.selectedRoleButton,
                ]}
                onPress={() => setUserType('ecoorganizador')}
              >
                <Text style={[styles.roleButtonText, userType === 'ecoorganizador' && styles.selectedRoleButtonText]}>
                  Eco Organizador
                </Text>
              </TouchableOpacity>
            </View>
              </View>
              <TouchableOpacity style={styles.loginButton} activeOpacity={0.7} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
              <View style={styles.signupContainer}>
              <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLinkBold}>Regístrate</Text>
              </TouchableOpacity>
            </View>

            </View>
        </TouchableWithoutFeedback>
      
        </View>
      
      </ScrollView>
      </KeyboardAvoidingView>
  );
}  

const styles = StyleSheet.create({
  roleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 2.2, // Espaciado horizontal entre los botones
    padding: 9,
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Color de fondo de los botones de roles
    borderRadius: 30, // Bordas circulares
  },
  roleButtonText: {
    color: '#47897E', // Color de texto de los botones de roles
  },
  selectedRoleButton: {
    backgroundColor: '#47897E', // Color de fondo cuando el rol está seleccionado
  },
  selectedRoleButtonText: {
    color: '#FFFFFF', // Color de texto cuando el rol está seleccionado

  },
  all: {
    flex: 1,
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la imagen al tamaño del contenedor
    alignItems: 'center',
    justifyContent: 'center',
    margin:0,
    padding:0,
    backgroundColor:'#F5F5F5',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    margin:0,
    padding:0,
    justifyContent:'center',
    alignItems:'center',
  },
  //Container de arriba
  topContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"yellow",
  },
  //Container de abajo
  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },

  
  logoContainer: {
    alignItems: "center",
    marginTop: 0,
    marginBottom: 1,
    marginTop: -55,
  },
  logo: {
    width: 260,
    height: 260,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  titleText: {
    fontSize: 30,
    color: "#478F86",
    textAlign: "center",
    marginBottom: 100,
    marginTop:4,
    fontFamily: "Caprasimo",
},
iconStyle: {
  marginRight: 10,
},
  inputContainer: {
    alignItems: "center",
    position: 'relative',
    marginBottom: 0,
  },
  input: {
    width: 290,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 25,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
    borderRadius: 20,
    height: 30,
    paddingLeft: 10,
    borderColor: "#FFFFFF",
    borderWidth: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
},
textInputContainer_: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
  borderRadius: 20,
  height: 30,
  paddingLeft: 10,
  borderColor: "#FFFFFF",
  borderWidth: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
},
inputWithIcon: {
  flex: 1,
  color: "black",
  fontSize: 17,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
},
  scrollViewContent: {
    flexGrow: 1,
  },

  circular_Container: {
    position: 'absolute',
    left: 35,
    top:  100, // Ajusta el valor según el espacio deseado entre los íconos
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: 38,
    height: 38,
    borderRadius: 40,
  },
  keyImage: {
    width: 28,
    height: 28,
    borderRadius: 1,
  },
  loginButton: {
    marginTop: -100,
    backgroundColor: "#47897E",
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  loginText: {
      color: "#FFEBEE",
      fontSize: 22,
      fontWeight: "bold",
  },
  nuevo: {
    marginBottom:143,
  },
  icon: {
    position: 'absolute', // Superpone el ícono dentro del contenedor de entrada
    top: 36, // Ajusta la posición vertical del ícono según tus necesidades
    left:14,
    width: 25,  // Ajusta el ancho del ícono según tus necesidades
    height: 25, // Ajusta la altura del ícono según tus necesidades
    zIndex: 1, // Asegura que los íconos estén en una capa superior
  },
  signupContainer: {
    flexDirection: 'row', // Muestra los elementos en línea
    alignItems: 'center', // Alinea verticalmente los elementos en el centro
    justifyContent: 'center', // Alinea horizontalmente los elementos en el centro
    marginTop:30,
  },
  signupText: {
    color: "black",
    fontSize: 16, // Tamaño de fuente del texto "¿No tienes cuenta?"
    //fontWeight: 'bold', 
  },
  signupLinkBold: {
    color: "black",
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold', // Hace que el texto "Regístrate" sea negrita
    fontSize: 16, // Tamaño de fuente del texto "Regístrate"
  },
  
});
