import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importación de componentes
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
import CalendarDia from './components/Calendar/dia';
import Crimes from './data/Crimes';
import RegisterCrime from './data/Register_Crime';
import { EventProvider } from './components/Context/EventContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const [userRole, setUserRole] = useState('');

  const fetchUserRole = useCallback(async () => {
    const role = await AsyncStorage.getItem('rol');
    setUserRole(role);
  }, []);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Posts') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'CreateEvent') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Crimes') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Posts" component={Posts} />
      {userRole === 'ecoorganizador' && (
        <Tab.Screen name="CreateEvent" component={CreateEvent} />
      )}
      {userRole === 'ecobuscador' && (
        <Tab.Screen name="Crimes" component={Crimes} />
      )}
      <Tab.Screen
        name="Profile"
        component={userRole === 'ecoorganizador' ? UserProfileOrg : UserProfile}
      />
      <Tab.Screen name="Calendar" component={CalendarDia} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <EventProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
        <Stack.Screen name="Homes" component={Homes} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="Crimes" component={Crimes} />
        <Stack.Screen name="RegisterCrime" component={RegisterCrime} />
        {/* Si tienes otras pantallas, asegúrate de agregarlas aquí */}
      </Stack.Navigator>
    </NavigationContainer>
    </EventProvider>
  );
}
