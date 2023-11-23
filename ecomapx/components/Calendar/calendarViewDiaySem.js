import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableWithoutFeedback, Dimensions, Alert} from "react-native"
import Modal from 'react-native-modal';
import { horas } from "./horas"
//import Tasks from "./tasks/tasksView";
import moment from 'moment';
import Swiper from 'react-native-swiper';
//import {getTasksDate} from '../../../chronos-app/app/api';
import { TouchableOpacity } from "react-native";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import ComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {compararHoras} from "./functions";
//import { TasksContext } from '../../app/TasksContext'; 
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('screen');

  const getUniqueColor = (eventId) => {
    const colors = [
      'pink', '#4CE862', 'skyblue', '#FFE633', '#EE62FF', 'lightcoral', '#3BA3FF', '#FF62A5',
    ];
  
    let sum = 0;
    for (let i = 0; i < eventId.length; i++) {
      sum += eventId.charCodeAt(i); // Suma los códigos de carácter Unicode de cada carácter del ID
    }
  
    const colorIndex = sum % colors.length; // Usa el total para obtener un índice dentro del rango de colores
    return colors[colorIndex];
  };
  

//cambiar tasks x events (+ adelante)
const calculateOverlap = (filteredEvents) => {
    let overlaps = {};
    
    filteredEvents.forEach((event) => {
      const eventStart = moment(event.hora, 'HH:mm').format('HH:mm');
      if (!overlaps[eventStart]) {
        overlaps[eventStart] = [];
      }
      overlaps[eventStart].push(event.id);
    });
  
    return overlaps;
};
  
//cambiar tasks x events (+ adelante)

const TasksList = React.memo(({ filteredEvents, containerHeight }) => {
  console.log("Tasks inside TasksList:", filteredEvents);
  const overlaps = calculateOverlap(filteredEvents);
  
  return (
    <View style={{ position: 'relative', flex: 1 }}>
      {filteredEvents.map((event) => {
        const eventStart = moment(event.hora, 'HH:mm').format('HH:mm');
        return (
          <TaskItem
            key={event.id}
            event={event}
            containerHeight={containerHeight}
            overlaps={overlaps[eventStart] || []}
          />
        );
      })}
    </View>
  );
});


const calculateTaskWidth = (numberOfOverlaps) => {
  switch (numberOfOverlaps) {
    case 1:
      return 300;
    case 2:
      return 150; 
    case 3:
      return 100; 
    case 4:
      return 75; 
    case 5:
      return 62.9; 
    default:
      return 380; 
  }
};

const calculateTaskLeft = (numberOfOverlaps, overlapIndex) => {
  switch (numberOfOverlaps) {
    case 1:
      return  (60 + overlapIndex * 92); 
    case 2:
      return  (60 + overlapIndex * 150); 
    case 3:
      return (60 + overlapIndex * 100); 
    case 4:
      return (60 + overlapIndex * 75); 
    case 5:
      return (60 + overlapIndex * 62.9); 
    default:
      return 380; 
  }
};


const TaskItem = ({ event, containerHeight, overlaps}) => { 
    const taskColor = getUniqueColor(event.id);
    console.log("taskColor: ",taskColor);

    const startTime = moment(event.hora, 'HH:mm');

    // Asumiendo que la duración está en minutos y es una cadena, conviértela a un número entero.
    const durationInMinutes = parseInt(event.duracion, 10);

    // Suma la duración a la hora de inicio para obtener la hora de finalización.
    const endTime = moment(startTime).add(durationInMinutes, 'minutes');

    // Formatea la hora de finalización al formato deseado, por ejemplo 'HH:mm'.
    const formattedEndTime = endTime.format('HH:mm');
  
    const topPosition = ((startTime.hours() * containerHeight) + ((startTime.minutes() / 60) * containerHeight))-1645;
    const taskHeight = (durationInMinutes / 60) * containerHeight;

    // Encuentra el índice de esta tarea en el arreglo de superposiciones
    const overlapIndex = overlaps.indexOf(event.id);
    const numberOfOverlaps = overlaps.length;
    console.log("numberOfOverlaps: ",numberOfOverlaps)


    console.log("taskWidth actual: ", taskWidth);

    const taskWidth = calculateTaskWidth(numberOfOverlaps); 
    const marginLeft = calculateTaskLeft(numberOfOverlaps, overlapIndex);
    const taskStyle = {
      position: 'absolute', 
      top: topPosition, //posicion de la tarea
      height: taskHeight, //alto de la tarea
      width: taskWidth, //ancho de la tarea
      marginLeft: marginLeft,
      borderRadius: 15,
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: taskColor, 
    };
    console.log("taskWidth actual2: ", taskWidth);

    console.log("StartTime:", startTime);
    console.log("EndTime:", formattedEndTime);
    console.log("Top Position:", topPosition);
    console.log("Task Height:", taskHeight);
  
  
    const timeStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,  // Separación entre el nombre de la tarea y el tiempo
    };

    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        console.log("Touched task. Modal should open.");
        setIsModalVisible(!isModalVisible);
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: 8, 
        right: 8,
      };
      
      const closeIconStyle = {
        fontSize: 33, // Tamaño del icono
        color: 'red', // Color del icono
      };

      const modalStyle = {
        backgroundColor: taskColor,
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        height: 513,
        width: 340,
     };

     const titleStyle ={
        fontWeight: 'bold',
        marginBottom: 75,
        marginTop: -100,
        fontSize: 28,
        textAlign: 'center',
     };
     
     const datextoStyle = {
        //backgroundColor: 'skyblue',
        fontWeight: 'bold',
        fontSize: 18,

     };
     const starttimeStyle={
        //backgroundColor: 'green',
        marginBottom: 20,

     };
     const endtimeStyle={
        //backgroundColor: 'yellow',
        marginBottom: 20,
     };

     const descripStyle={
        marginBottom: 20,
        //backgroundColor: 'orange',
        
     };

     const placeStyle={
        
     };

     const datedStyle = {
        flexDirection: 'row',  // Para alinear ícono y texto en la misma línea
        alignItems: 'center',  // Alinear verticalmente en el centro
        marginBottom: 10,
        marginTop: -45,
        //backgroundColor: 'red',
    };

    const startStyle = {
        flexDirection: 'row',  // Para alinear ícono y texto en la misma línea
        alignItems: 'center',  // Alinear verticalmente en el centro
        marginBottom: 10,
        marginTop: 0,
        //backgroundColor: 'red',
    };

    const endStyle = {
        flexDirection: 'row',  // Para alinear ícono y texto en la misma línea
        alignItems: 'center',  // Alinear verticalmente en el centro
        marginBottom: 10,
        marginTop: 0,
        //backgroundColor: 'red',
    };

    const descStyle = {
      flexDirection: 'row',  
      alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 0,
        flexWrap: 'wrap',  
    };

    const descStyle2 = {
      flexDirection: 'row',  
      alignItems: 'flex-start',
      marginTop: -8,
      flexWrap: 'wrap',  
      paddingHorizontal: 30,
      marginBottom: 10,

    };

    const ubiStyle = {
      flexDirection: 'row',  
      alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 0,
        flexWrap: 'wrap',  
    };

    const ubiStyle2 = {
      flexDirection: 'row',  
      alignItems: 'flex-start',
      marginTop: -8,
      flexWrap: 'wrap',  
      paddingHorizontal: 30,
      marginBottom: 10,
    };

    const contentTextStyle = {
      fontSize: 17,
      paddingVertical: 3, 
  };
  

    
    const iconStyle = {
        marginRight: 5,  // Espaciado entre ícono y texto.
    };

     const formattedDate = moment(event.fecha, "DD/MM/YYYY").format('ddd, DD MMM YYYY');
     
     return (
      <View>
      <TouchableOpacity onPressIn={toggleModal}>
          <View style={taskStyle}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{event.nombre}</Text>
            <View style={timeStyle}>
              <Text>⏰</Text>
              <Text style={{ marginLeft: 5 }}>{event.hora} - {formattedEndTime}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Modal isVisible={isModalVisible}>
          <View style={modalStyle}> 
            <TouchableOpacity style={closeButtonStyle} onPress={toggleModal}>
              <FontistoIcon name="close" style={closeIconStyle} />
            </TouchableOpacity>
    
          
            <Text style={titleStyle}>{event.nombre}</Text>
            <View style={datedStyle}>
              <ComunityIcon name="calendar-clock" size={23} color="#000" marginTop={3} style={iconStyle} />
              <Text style={datextoStyle}>Fecha: </Text> 
              <Text style={{fontSize: 17}}>{formattedDate}</Text>
            </View>
            <View style={startStyle}>
              <ComunityIcon name="clock-time-three" size={23} color="#000" marginTop={2} style={iconStyle} /> 
              <Text style={datextoStyle}>Hora Inicio: </Text> 
              <Text style={{fontSize: 17}}>{event.hora}</Text>
            </View>
            <View style={endStyle}>
              <Ionicons name="timer" size={23} color="#000" marginTop={3} style={iconStyle} /> 
              <Text style={datextoStyle}>Hora Fin: </Text> 
              <Text style={{fontSize: 17}}>{formattedEndTime}</Text>
            </View>
            {event.descripcion && (
              <>
                <View style={descStyle}>
                  <ComunityIcon name="text" size={23} color="#000" style={iconStyle} /> 
                  <Text style={datextoStyle}>Descripción: </Text> 
                </View>
                <View style={descStyle2}>
                  <Text style={contentTextStyle}>{event.descripcion}</Text>
                </View>
              </>
            )}

            {event.ubicacion && (
              <>
              <View style={ubiStyle}>
              <FontistoIcon name="map-marker-alt" size={21} color="#000" marginTop={2} paddingHorizontal={2} style={iconStyle} /> 
              <Text style={datextoStyle}> Ubicación: </Text> 
              </View>
              <View style={ubiStyle2}>
              <Text style={contentTextStyle}>{event.ubicacion}</Text>
              </View>
              </>
            )}
          </View>
        </Modal>
      </View>
    );
  };


export default function CalendarViewDiaySem() {
    const swiper = React.useRef();
    const [value, setValue] = React.useState(new Date());
    const [week, setWeek] = React.useState(0);
    const [currentHour, setCurrentHour]= useState(new Date().getHours());
    const [currentMinute, setCurrentMinute]= useState(new Date().getMinutes());
    const [left, setLeft] = useState(140);
    const totalInterval = 70.0/60;
    //const { tasks, refreshTasks } = useContext(TasksContext);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
      // Asegúrate de pasar la fecha actual a fetchEventos
      fetchEventos(value);
    }, [value]); // La dependencia [value] garantiza que useEffect se ejecute cada vez que la fecha cambie
  
    const fetchEventos = async (selectedDate) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'No se encontró el token de autenticación.');
          return;
        }
  
        const response = await fetch(`http://192.168.0.17:5000/get_events_by_organizer`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const allEvents = await response.json();
        if (response.ok) {
          // Filtrar los eventos que coincidan con la fecha actual
          const selectedDay = moment(selectedDate).format('YYYY-MM-DD');
          const filteredEvents = allEvents.filter(event => {
            const eventDate = moment(event.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
            return moment(eventDate).isSame(selectedDay);
          });
          console.log("VALUE: ", value);
          console.log("FECHA - SELECCIONADA: ", selectedDay);
          console.log("EVENTOS DEL DIA SELECCIONADO: ", filteredEvents);
          setEventos(filteredEvents);
        } else {
          Alert.alert('Error', allEvents.error || 'Error al obtener los eventos del organizador.');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
      }
    };
      

    {/*
    // Actualiza las tareas cuando la pestaña gana foco
    useFocusEffect(
      React.useCallback(() => {
        refreshTasks(value);
      }, [value, refreshTasks])
    );

    useEffect(() => {
      refreshTasks(value); // Pasa la fecha seleccionada a refreshTasks
    }, [value, refreshTasks]);

  */}
      
    const style_customized = StyleSheet.create({
        barra: {
          flex: 1,
          borderLeftWidth: 1.5,
          borderColor: '#AB3D52',
          borderStyle: 'solid', //antes de pushear o algo volver a cambiar a 'dashed'
          width: 0,
          height: "90%",
          position: 'absolute',
          left: left,
          bottom: 0,
        }
      })
    useEffect(() => {
        const intervarlId = setInterval(() => {
          const now = new Date();
          setCurrentHour(now.getHours());
          setCurrentMinute(now.getMinutes());
          setLeft(((now.getHours())*60 + now.getMinutes())*totalInterval + 35);
        }, 1000);
    
        return () => {
          clearInterval(intervarlId);
        }
    }, []);

    const obtenerEstilo = (hora) => {
        if (currentHour == hora)
          return styles.horaSombreada;
        return styles.horaNormal;
    } 


    const containerHeight = 70; // Altura de cada contenedor de hora

    const horas_text = [];
    Object.keys(horas).map((hora) => {
    // Utilizando padStart para formatear las horas en el formato "00:00"
    const formattedHour = hora.toString().padStart(2, '0');

    horas_text.push(
        <View key={horas[hora]} style={[styles.hora_view, { height: containerHeight }]}>
        <Text style={obtenerEstilo(hora)}> {formattedHour}:00 </Text>
        <View style={styles.hora_divisor}></View>
        </View>
    );
    });



    const weeks = React.useMemo(() => {
        const start = moment(start).add(week, 'weeks'). startOf('week');
        return[-1,0,1].map(adj =>{
            return Array.from({ length: 7}).map((_, index) => {
                const date = moment(start).add(adj, 'week').add(index, 'day');
                return {
                    weekday: date.format('ddd'),
                    date: date.toDate(),
                };
            });
        });
    }, [week]);

  return (
    <SafeAreaView style = {{flex: 1}}>
        <View style={styles.container}>
            <View style={styles.picker}>
                <Swiper
                index={1}
                ref={swiper}
                showsPagination={false}
                loop={false}
                onIndexChanged={ind => {
                    if(ind === 1){
                        return;
                    }
                setTimeout (() => {
                    const newIndex = ind - 1;
                    const newWeek = week + newIndex;
                    setWeek(newWeek);
                    setValue(moment(value).add(newIndex, 'week').toDate());
                    swiper.current.scrollTo(1,false);
                }, 100);
                }}>
                {weeks.map((dates, index) => (
                <View
                style={[styles.itemRow,{paddingHorizontal: 16}]} 
                key={index}>
                {dates.map((item, dateIndex) => {
                    const isActive =
                    value.toDateString() === item.date.toDateString();
                    return(
                        <TouchableWithoutFeedback
                        key={dateIndex}
                        onPress={() => setValue(item.date)}>
                        <View 
                           style={[
                                styles.item,
                                isActive && {
                                    backgroundColor: '#2C9840',
                                    borderColor: '#2C9840',
                                },
                           ]}>
                        <Text
                        style={[
                            styles.itemWeekday,
                            isActive && {color: '#fff'},
                        ]}>
                        {item.weekday}
                        </Text>
                        <Text 
                        style={[
                            styles.itemDate, 
                            isActive && {color: '#fff'},
                        ]}>
                        {item.date.getDate()}
                        </Text>
                        </View>     
                        </TouchableWithoutFeedback>
                    );
                })}
                </View>
                ))}
                </Swiper>
            </View>

            <View style={{flex: 1, paddingVertical: 24}}>
                <Text style={styles.contentText}>{value.toDateString()}</Text>
                <ScrollView> 
                    <View style={styles.xd}>
                        {horas_text}
                    </View>
                    <TasksList filteredEvents={eventos} containerHeight={containerHeight} />
                </ScrollView>
            </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    hora_view: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16, // Espacio a la izquierda de cada hora
        //backgroundColor:'yellow',
        //borderWidth:3,
        //borderColor:'red',
      },
      hora_divisor: {
        flex: 1,
        borderBottomWidth: 0.5, // Grosor más delgado para la línea
        borderBottomColor: '#2C9840',
        marginRight: '-1000%',
    },
      horaSombreada: {
        //hora actual
        backgroundColor: '#2C9840',
      },
      horaNormal: {
        // Estilos para otras horas
      },
    all: {
        //backgroundColor: 'yellow',
    },
    calendar_scroll: {
    flex: 1,
    backgroundColor: '#fff',
    height: 10,
    flexGrow: 1,
    width: '100%',
    paddingTop: '3%',
    flexDirection: 'row'
  },

  container:{
    flex: 1,
    paddingVertical: 5,
    backgroundColor: 'white',

  },
  picker:{
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentText:{
    fontSize: 17,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    marginTop: -3,
    textAlign: 'center',
  },
  itemRow:{
    width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  item:{
    flex: 1,
    height: 50,
    marginHorizontal: 3,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'column',
    
  },
  itemWeekday:{
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate:{
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  placeholder:{
    flex:1,
    height:400,
    backgroundColor: 'red',
  },
  placeholderContent: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'solid', 
    borderRadius: 9,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  btn:{
    flexDirection: 'row',
    backgroundColor: '#007aff',
    borderWidth: 1,
    borderColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText:{
    fontSize: 18,
    fontWeight: '600',
    color:'#fff',
  }
})
