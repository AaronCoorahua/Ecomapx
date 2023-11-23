import React, {useEffect, useState} from "react";
import { StyleSheet, View, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderDia from "./headerDia";
//import CalendarView from "../../components/calendar/calendarView";
import CalendarViewDiaySem from "./calendarViewDiaySem";


export default function CalendarDia() {
  const [tasks, setTasks] = useState([]);
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderDia />
      </View>
      <View style={styles.calendar}>
        <CalendarViewDiaySem />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow:1,
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
  header: {
    flexGrow: 1,
    height: '13%',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop:-33,
  },
  calendar: {
    flexGrow: 1,
    height: '55%',
    width: '100%',
    overflow: 'hidden',
  }

});
