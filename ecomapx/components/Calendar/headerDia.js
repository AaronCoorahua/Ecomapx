import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    Platform,
    ScrollView
  } from "react-native";
  import Icon from "react-native-vector-icons/FontAwesome5";
  import React, { useState, useEffect, useContext} from "react";
  //import AppLoading from "expo-app-loading";
  import * as Font from "expo-font";
  //import LottieView from "lottie-react-native";
  import DateTimePicker from "@react-native-community/datetimepicker";
  //import { getTasksDate, createTask } from "../../app/api";
  import RNDateTimePicker from "@react-native-community/datetimepicker";
  import { useNavigation } from '@react-navigation/native';
  //import { router } from "expo-router";
  //import { TasksContext } from '../../app/TasksContext';

  
  function MicrophoneAnimation() {
    return (
      <LottieView
        style={styles.animationExpanded}
        source={require("../../assets/animations/voz.json")}
        autoPlay
        loop
      />
    );
  }

  
  export default function HeaderDia() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const [selectedEndTime, setSelectedEndTime] = useState(new Date());
    const [isModalVisible, setModalVisible] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [modalVisible, setmodalVisible] = useState(false);
    const [name, setName] = useState("");
    const [place, setPlace] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [dia, setDia] = useState("");
    const [State, setState] = useState("");
    const navigation = useNavigation();
    //const { refreshTasks } = useContext(TasksContext);
  
    async function loadFonts() {
      await Font.loadAsync({
        Gabarito: require("../../assets/fonts/Gabarito-VariableFont_wght.ttf"),
      });
    }
  
    useEffect(() => {
      // Cargar fuentes y otros recursos
      async function loadData() {
        await loadFonts();
        // Puedes agregar más carga de recursos aquí si es necesario
      }
  
      loadData();
    }, []);
  /*
    if (!fontsLoaded) {
      return (
        <AppLoading
          startAsync={loadFonts}
          onFinish={() => setFontsLoaded(true)}
          onError={console.warn}
        />
      );
    }
    */
    const onAddTaskPress = () => {
      setmodalVisible(true);
    };
  
    const onMicrophonePress = () => {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
      }, 10000);
    };
  
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
  /*
    const onSelectOption = (option) => {
      console.log(`${option} Selected`);
      if (option === "Month"){
        router.push("/calendar/mes");
      }
      toggleModal();
    };
    */
    const DateModal = () => (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          {["Day", "Month"].map((option) => (
            <TouchableOpacity key={option} onPress={() => onSelectOption(option)}>
              <Text style={styles.modalText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    );
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    let greeting = "Good Morning!";
  
    if (currentHour >= 12 && currentHour < 18) {
      greeting = "Good Afternoon!";
    } else if (currentHour >= 18 || currentHour < 6) {
      greeting = "Good Evening!";
    }
  
    const onDateChange = (event, selectedDate) => {
      setDatePickerVisibility(Platform.OS === "ios");
      if (selectedDate) {
        setDatePickerVisibility(false);
        setSelectedDate(selectedDate);
        const offset = selectedDate.getTimezoneOffset() * 60000;
        const localDate = new Date(selectedDate.getTime() - offset);
        const formattedDate = localDate.toISOString().split("T")[0]; // Formato 'yyyy-mm-dd'
        setDia(formattedDate);
      } else {
        setDatePickerVisibility(false);
      }
    };
  
    const onTimeChange = (event, selectedTime) => {
      setTimePickerVisibility(Platform.OS === "ios");
      if (Platform.OS === "android") {
        setTimePickerVisibility(false);
      }
      if (selectedTime) {
        setTimePickerVisibility(false);
        setSelectedTime(selectedTime);
        let hours = selectedTime.getHours().toString().padStart(2, "0");
        let minutes = selectedTime.getMinutes().toString().padStart(2, "0");
        let formattedTime = `${hours}:${minutes}`;
  
        setStartTime(formattedTime);
      } else {
        setTimePickerVisibility(false);
      }
    };
    const onEndTimeChange = (event, selectedTime) => {
      setEndTimePickerVisibility(Platform.OS === "ios");
      if (Platform.OS === "android") {
        setEndTimePickerVisibility(false);
      }
      if (selectedTime) {
        setEndTimePickerVisibility(false);
        setSelectedEndTime(selectedTime);
        let hours = selectedTime.getHours().toString().padStart(2, "0");
        let minutes = selectedTime.getMinutes().toString().padStart(2, "0");
        let formattedTime = `${hours}:${minutes}`;
  
        setEndTime(formattedTime);
      } else {
        setEndTimePickerVisibility(false);
      }
    };
  
    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
    const showTimePicker = () => {
      setTimePickerVisibility(true);
    };
    const showEndTimePicker = () => {
      setEndTimePickerVisibility(true);
    };
  
    const onChange = async (event, selectedDate) => {
      console.log(selectedDate);
      const currentDate = selectedDate || date;
      setShow(false);
      const formattedDate = selectedDate.toDateString();
      console.log("dia: ", formattedDate);
      const body = {
        type_search: 1,
        begin_date: formattedDate,
      };
      const dataTasks = await getTasksDate(body);
      if (data.success) setTasks(dataTasks.tasks);
    };
    const handleCloseModal = () => {
      setmodalVisible(false);
    };
    const handleSaveTask = async () => {
      if (!name.trim()) {
        alert("Por favor, ingrese el nombre de la tarea.");
        return;
      }
      if (!dia.trim()) {
        alert("Por favor, ingrese la fecha de la tarea.");
        return;
      }
      if (!startTime.trim()) {
        alert("Por favor, ingrese la hora de inicio de la tarea.");
        return;
      }
      if (!endTime.trim()) {
        alert("Por favor, ingrese la hora de finalización de la tarea.");
        return;
      }
  
      const formData = {
        name: name.trim(),
        place: place.trim(),
        description: description.trim(),
        state: State.trim(),
        date: dia.trim(),
        start_time: startTime.trim(),
        end_time: endTime.trim(),
      };
  
      try {
        const data = await createTask(formData);
        console.log("Success:", data);
        setModalVisible(false);
        setName("");
        setPlace("");
        setDescription("");
        setDia("");
        setStartTime("");
        setEndTime("");
        refreshTasks(formData.date); // Usando la fecha de la tarea que se acaba de crear
      } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar la tarea. Por favor, intente de nuevo.");
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.greetingHeader}>
          <TouchableOpacity onPress={toggleModal} style={styles.buttonlist}>
            <Icon name="list" size={18} color="#2C9840" />
            <Text style={styles.text}>Today</Text>
          </TouchableOpacity>
          <DateModal />
          <Text style={styles.greetingTitle}>{greeting}</Text>
          <Text style={styles.greetingSubtitle}>Chronos</Text>
          <View style={styles.buttonsContainer}>
            {isRecording && <MicrophoneAnimation />}
            <TouchableOpacity style={styles.button} onPress={onMicrophonePress}>
              <Icon name="microphone-alt" size={28} color="#2C9840" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onAddTaskPress}>
              <Icon name="plus-circle" size={28} color="#2C9840" />
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={handleCloseModal}
            >
              <ScrollView contentContainerStyle={styles.modalView}>
                <TextInput
                  style={styles.input}
                  placeholder="Task Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date"
                  value={dia}
                  onChangeText={setDia}
                  onFocus={showDatePicker}
                  editable={!isDatePickerVisible}
                />
                {isDatePickerVisible && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Start Time"
                  value={startTime}
                  onChangeText={setStartTime}
                  onFocus={showTimePicker}
                  editable={!isTimePickerVisible}
                />
  
                {isTimePickerVisible && (
                  <RNDateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                    onTouchCancel={() => setTimePickerVisibility(false)}
                  />
                )}
  
                <TextInput
                  style={styles.input}
                  placeholder="End Time"
                  value={endTime}
                  onChangeText={setEndTime}
                  onFocus={showEndTimePicker}
                  editable={!isEndTimePickerVisible}
                />
  
                {isEndTimePickerVisible && (
                  <RNDateTimePicker
                    value={selectedEndTime}
                    mode="time"
                    display="default"
                    onChange={onEndTimeChange}
                    onTouchCancel={() => setEndTimePickerVisibility(false)}
                  />
                )}
  
                <TextInput
                  style={styles.input}
                  placeholder="Place (Optional)"
                  value={place}
                  onChangeText={setPlace}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description (Optional)"
                  value={description}
                  onChangeText={setDescription}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveTask}
                >
                  <Text style={styles.textbutton}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.textbutton}>Cancelar</Text>
                </TouchableOpacity>
              </ScrollView>
            </Modal>
          </View>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      paddingTop: 55,
    },
    greetingHeader: {
      padding: 15,
      backgroundColor: "#ffffff",
      justifyContent: "center",
      alignItems: "right",
      height: 140,
    },
    greetingTitle: {
      fontSize: 30,
      color: "#2C9840",
      paddingTop: 20,
    },
    greetingSubtitle: {
      fontSize: 25,
      fontWeight: "bold",
      color: "#2C9840",
      marginTop: 20,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      padding: 2,
      marginTop: -54,
      marginLeft: 260,
    },
    buttonlist: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 2,
    },
    button: {
      backgroundColor: "#ffffff",
      borderRadius: 50,
      padding: 9,
      marginHorizontal: '1%',
      borderColor: "#2C9840",
      borderWidth: 3,
      alignSelf: "flex-end",
      top: -40,
      marginLeft: 6,
    },
    title: {
      fontSize: 25,
      fontWeight: "bold",
      color: "#982C40",
      fontFamily: "Gabarito",
      paddingTop: 10,
    },
    text: {
      fontSize: 18,
      //fontWeight: 'bold',
      color: "#2C9840",
    },
    modalContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      width: "40%",
      backgroundColor: "rgba(250,250,250,0.7)",
    },
    modalText: {
      fontSize: 18,
      color: "#2C9840",
      padding: 10,
      borderTopWidth: 1,
    },
    animationExpanded: {
      width: 380,
      height: 380,
      position: "absolute",
      top: "-18%",
      left: "-1%",
      zIndex: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    modalMessageContainer: {
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      alignItems: "center",
    },
    modalMessage: {
      fontSize: 16,
      marginBottom: 10,
      right: -10,
      fontFamily: "Gabarito",
      color: "#982C40",
    },
    modalView: {
      margin: 20,
      backgroundColor: "#ffedf1",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      top: "15%",
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: "88%",
      height: "68%",
      overflow: "scroll",
    },
    input: {
      width: "75%",
      padding: 6,
      margin: 10,
      borderWidth: 2,
      borderColor: "#982C40",
      borderRadius: 15,
      backgroundColor: "#ffffff",
      fontFamily: "Gabarito",
    },
    saveButton: {
      backgroundColor: "#ffffff",
      borderRadius: 50,
      padding: 5,
      marginLeft: 15,
      borderColor: "#982C40",
      borderWidth: 2,
      top: -6,
      left: -92,
      marginBottom: 10,
      marginTop: 15,
      fontFamily: "Gabarito",
    },
    cancelButton: {
      backgroundColor: "#ffffff",
      borderRadius: 50,
      padding: 5,
      marginLeft: 15,
      borderColor: "#982C40",
      borderWidth: 2,
      top: -42,
      left: 75,
    },
    textbutton: {
      fontSize: 13,
      fontFamily: "Gabarito",
      color: "#982C40",
    },
  });
  