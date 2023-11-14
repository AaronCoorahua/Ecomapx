import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Inicio from './components/Inicio/Inicio';
import Login from './components/Inicio/Login';
import Register from './components/Inicio/Register';
import Homes from './components/Inicio/Homes';  
import Posts from './components/Eventos/Posts';
import Event from './components/Eventos/Event';
import UserProfile from './components/Profiles/UserProfile';
import UserProfileOrg from './components/Profiles/UserProfileOrg';
import CreateEvent from './components/Eventos/Create_event';
import CalendarViewDiaySem from './components/Calendar/calendarViewDiaySem';


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
  {/* Solo un Tab.Screen para el perfil que renderiza diferentes componentes dependiendo del rol */}
  <Tab.Screen 
    name="Profile" 
    component={userRole === 'ecoorganizador' ? UserProfileOrg : UserProfile} 
  />
  {userRole === 'ecoorganizador' && (
    <Tab.Screen 
      name="Add" 
      component={CreateEvent} 
      listeners={({ navigation }) => ({
        tabPress: event => {
          event.preventDefault();
          navigation.navigate('CreateEvent');
        },
      })}
    />
  )}
  <Tab.Screen name="Calendar" component={CalendarViewDiaySem} />
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