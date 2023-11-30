import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear el contexto de eventos
export const EventContext = createContext();

// Hook personalizado para usar el contexto de eventos
export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const updateEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.0.17:5000/listEvents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <EventContext.Provider value={{ events, updateEvents }}>
      {children}
    </EventContext.Provider>
  );
};
