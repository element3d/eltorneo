import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import strings from './Strings';

const Calendar = ({setDate}) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const today = moment();
    const daysArray = [];
    for (let i = -3; i <= 3; i++) {
      daysArray.push(today.clone().add(i, 'days').format('YYYY-MM-DD'));
    }
    setDates(daysArray);
    setDate(today.format('YYYY-MM-DD'))
    setSelectedDate(today.format('YYYY-MM-DD')); // Initialize today as selected
  }, []);

  const handlePress = (date) => {
    setSelectedDate(date);
    setDate(date)
  };

  return (
    <View style={styles.container}>
      {dates.map((date, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dayContainer,
            selectedDate === date ? styles.selected : {}
          ]}
          onPress={() => handlePress(date)}
        >
          <Text style={[
            styles.day,
            selectedDate === date ? styles.selectedText : {}
          ]}>
            {strings[moment(date).format('ddd').toLowerCase()]}
          </Text>
          <Text style={[
            styles.date,
            selectedDate === date ? styles.selectedText : {}
          ]}>
            {moment(date).format('DD')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dayContainer: {
    width: 50,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    // marginHorizontal: 5,
  },
  selected: {
    backgroundColor: '#FF2882', // Background color for selected day
  },
  day: {
    fontSize: 12,
    fontWeight: 'light',
    color: '#AEAEB2', // Default text color
  },
  date: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black', // Default text color
  },
  selectedText: {
    color: 'white', // Text color for selected day
  },
});

export default Calendar;
