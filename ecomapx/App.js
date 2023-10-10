import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground } from 'react-native';
import Inicio from './components/Inicio';
import Login from './components/Login';
import Register from './components/Register';  // Asegúrate de importar Register

export default function App() {
    const [view, setView] = useState('loading'); // 'loading', 'login', 'loggedIn', 'register'

    useEffect(() => {
        const timer = setTimeout(() => {
            setView('login');
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleSuccessfulLogin = () => {
        setView('loggedIn');
    };

    const handleSuccessfulRegister = () => {
        Alert.alert('Éxito', 'Registro completado. Ahora puedes iniciar sesión.');
        setView('login');
    };

    const goToRegister = () => {
        setView('register');
    };

    const goToLogin = () => {
        setView('login');
    };

    if (view === 'loading') {
        return <Inicio />;
    } else if (view === 'login') {
        return (
            <View style={{flex: 1}}>
                <Login onSuccessfulLogin={handleSuccessfulLogin} />
                <Button title="Registrarse" onPress={goToRegister} />
            </View>
        );
    } else if (view === 'register') {
        return (
            <View style={{flex: 1}}>
                <Register onSuccessfulRegister={handleSuccessfulRegister} />
                <Button title="Volver al inicio de sesión" onPress={goToLogin} />
            </View>
        );
    } else {
        return (
            <ImageBackground source={require('./assets/larcomar.jpg')} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <Text style={styles.text}>¡Has iniciado sesión!</Text>
                    <Image source={{ uri: 'https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png' }} style={{ width: 200, height: 200 }} />
                    <Button title="Cerrar sesión" onPress={goToLogin} />
                </View>
            </ImageBackground>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    text: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
    },
});