//CalendarViewDiaySem (todo es dinamico y solo falta poner + estetico el modal cuando se presiona una tarea *nda + uwu*)
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableWithoutFeedback, Dimensions} from "react-native"
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

const {width} = Dimensions.get('screen');

const getUniqueColor = (taskId) => {
    const colors = [
    //pink, verdebonito, skyblue, amarillo, moradito, lightcoral, azuleado, fucsia/rosado
      'pink', '#4CE862', 'skyblue', '#FFE633', '#EE62FF', 'lightcoral', '#3BA3FF', '#FF62A5', 
    ];
  
    const colorIndex = taskId % colors.length; // Usando el id de la tarea se obteniene un índice de color especifico uwu
    return colors[colorIndex];
  };

 {/*  

const TasksList = ({ tasks, containerHeight }) => {
  console.log("Tasks inside TasksList:", tasks);
  return (
    <View style={{ position: 'relative', flex: 1 }}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} containerHeight={containerHeight} />
      ))}
    </View>
  );
};

const TaskItem = ({ task, containerHeight }) => {
    const taskColor = getUniqueColor(task.id);
    const startTime = moment(task.start_time, 'HH:mm');
    const endTime = moment(task.end_time, 'HH:mm');
  
    const durationInMinutes = endTime.diff(startTime, 'minutes');
  
    const topPosition = ((startTime.hours() * containerHeight) + ((startTime.minutes() / 60) * containerHeight))-1645;
    const taskHeight = (durationInMinutes / 60) * containerHeight;
  
    const taskStyle = {
      position: 'absolute',
      top: topPosition,
      height: taskHeight,
      width: '78%',
      marginLeft: 60,
      borderRadius: 15,
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: taskColor, 
    };

    console.log("StartTime:", startTime);
    console.log("EndTime:", endTime);
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
        //backgroundColor: 'red',
    };

    const ubiStyle = {
      flexDirection: 'row',  
      alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 0,
        flexWrap: 'wrap',  
        //backgroundColor: 'red',
    };

    const contentTextStyle = {
      fontSize: 17,
      paddingVertical: 3, 
  };
  

    
    const iconStyle = {
        marginRight: 5,  // Espaciado entre ícono y texto.
    };

     const formattedDate = moment.utc(task.date).format('ddd, DD MMM YYYY');
     
     return (
      <View>
        <TouchableOpacity onPress={toggleModal}>
          <View style={taskStyle}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{task.name}</Text>
            <View style={timeStyle}>
              <Text>⏰</Text>
              <Text style={{ marginLeft: 5 }}>{task.start_time} - {task.end_time}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Modal isVisible={isModalVisible}>
          <View style={modalStyle}>
           //Botón de cierre del modal "X" 
            <TouchableOpacity style={closeButtonStyle} onPress={toggleModal}>
              <FontistoIcon name="close" style={closeIconStyle} />
            </TouchableOpacity>
    
            // Contenido del modal 
            <Text style={titleStyle}>{task.name}</Text>
            <View style={datedStyle}>
              <ComunityIcon name="calendar-clock" size={23} color="#000" style={iconStyle} />
              <Text style={datextoStyle}>Fecha: </Text> 
              <Text style={{fontSize: 17}}>{formattedDate}</Text>
            </View>
            <View style={startStyle}>
              <ComunityIcon name="clock-time-three" size={23} color="#000" style={iconStyle} /> 
              <Text style={datextoStyle}>Hora Inicio: </Text> 
              <Text style={{fontSize: 17}}>{task.start_time}</Text>
            </View>
            <View style={endStyle}>
              <Ionicons name="timer" size={23} color="#000" style={iconStyle} /> 
              <Text style={datextoStyle}>Hora Fin: </Text> 
              <Text style={{fontSize: 17}}>{task.end_time}</Text>
            </View>
    
            // Condición para mostrar descripción solo si no es null 
            {task.description && (
                <View style={descStyle}>
                <ComunityIcon name="text" size={23} color="#000" style={iconStyle} /> 
                <Text style={datextoStyle}>Descripción: </Text> 
                <Text style={contentTextStyle}>{task.description}</Text>
                </View>
            )}
    
            // Condición para mostrar ubicación solo si no es null 
            {task.place && (
              <View style={ubiStyle}>
              <FontistoIcon name="map-marker-alt" size={21} color="#000" style={iconStyle} /> 
              <Text style={datextoStyle}> Ubicación: </Text> 
              <Text style={contentTextStyle}>{task.place}</Text>
              </View>
            )}
          </View>
        </Modal>
      </View>
    );
    
};

*/}

export default function CalendarViewDiaySem() {
    const swiper = React.useRef();
    const [value, setValue] = React.useState(new Date());
    const [week, setWeek] = React.useState(0);
    const [currentHour, setCurrentHour]= useState(new Date().getHours());
    const [currentMinute, setCurrentMinute]= useState(new Date().getMinutes());
    const [left, setLeft] = useState(140);
    const totalInterval = 70.0/60;
    
    // Cambia el estado inicial de tareas a un arreglo vacío
    const [tasks, setTasks] = useState([]);

    // useEffect para cargar las tareas cuando el componente se monta o la fecha cambia
/*
    useEffect(() => {
        const loadTasks = async () => {
          try {
            const formData = {
                type_search: 1,
                begin_date: moment(value).format('YYYY-MM-DD')
            };
            const response = await getTasksDate(formData);
            console.log('Tasks fetched:', response); 
            
            if (response && response.success) { 
                const tasksWithFormattedTime = response.tasks.map(task => ({
                  ...task,
                  start_time: moment(task.start_time, 'HH:mm:ss').format('HH:mm'), // Convertierto a formato 'HH:mm'
                  end_time: moment(task.end_time, 'HH:mm:ss').format('HH:mm') // Convertierto a formato 'HH:mm'
              }));
              tasksWithFormattedTime.sort(compararHoras); // Ordenando las tareas
              setTasks(tasksWithFormattedTime); // Actualizando el estado con las tareas ordenadas
            } else {
              throw new Error('NO HAY TAREAS ESE DIA / API call was not successful');
            }
          } catch (error) {
            console.log("Error fetching tasks:", error.message);
            setTasks([]); // Vaciando la lista de tareas en caso de error
          }
        };
      
        loadTasks();
      }, [value]); // Dependencia de useEffect
      
*/
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
                    {/*<TasksList tasks={tasks} containerHeight={containerHeight} />*/}
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
    marginHorizontal: -4,
  },
  item:{
    flex: 1,
    height: 50,
    marginHorizontal: 4,
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
    borderStyle: 'solid', //antes de pushear o algo volver a cambiar a 'dashed'
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
