import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Inicio from './components/Inicio';
import Login from './components/Login';
import Register from './components/Register';
import Homes from './components/Homes';  
import Posts from './components/Posts';
import Event from './components/Event';
import UserProfile from './components/UserProfile';
import CreateEvent from './components/Create_event';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            const role = await AsyncStorage.getItem('rol');
            setUserRole(role);
        };
        fetchUserRole();
    }, []);

    return (
        <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Posts') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
      } else if (route.name === 'Tasks') {
        iconName = focused ? 'list' : 'list-outline';
      } else if (route.name === 'Add') {
        iconName = focused ? 'add-circle' : 'add-circle-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  })}
>
  <Tab.Screen name="Posts" component={Posts} />
  <Tab.Screen name="Tasks" component={UserProfile} />
  {userRole === 'ecoorganizador' && (
    <Tab.Screen 
      name="Add" 
      component={Register} 
      listeners={({ navigation }) => ({
        tabPress: event => {
          event.preventDefault();
          navigation.navigate('CreateEvent');
        },
      })}
    />
  )}
  <Tab.Screen name="Profile" component={UserProfile} />
</Tab.Navigator>
  );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Inicio">
                <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
                <Stack.Screen name="Homes" component={Homes} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Event" component={Event} />
                <Stack.Screen name="CreateEvent" component={CreateEvent} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}