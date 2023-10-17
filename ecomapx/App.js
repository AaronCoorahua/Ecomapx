import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './components/Inicio';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';  
import Posts from './components/Posts';
import Event from './components/Event';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Inicio">
                <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Posts" component={Posts} options={{ title: 'Publicaciones' }} />
                <Stack.Screen name="Event" component={Event} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}