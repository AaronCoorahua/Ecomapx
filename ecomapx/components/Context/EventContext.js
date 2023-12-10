import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear el contexto de eventos
export const EventContext = createContext();

// Hook personalizado para usar el contexto de eventos
export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [followedEvents, setFollowedEvents] = useState([]);

  const updateEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.0.17:5000/listEvents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error(`Error HTTP! Estado: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const updateFollowedEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch('http://192.168.0.17:5000/listFollowedEvents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId })
      });

      if (!response.ok) {
        console.error(`Error HTTP! Estado: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setFollowedEvents(data); // Actualiza el estado de los eventos seguidos
    } catch (error) {
      console.error("Error fetching followed events:", error);
    }
  };

  return (
    <EventContext.Provider value={{ events, updateEvents, followedEvents, updateFollowedEvents }}>
      {children}
    </EventContext.Provider>
  );
};
