import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import moment from 'moment';
import CalendarIcon from './assets/calendar_black.svg';
import CalendarWhiteIcon from './assets/calendar_white.svg';
import MatchItem from './MatchItem'; // Ensure you import your component correctly
import strings from './Strings';
import dataManager from './DataManager';
import authManager from './AuthManager';
import Colors from './Colors';

const UserMatchesList = ({ navigation, user, selectedStat, hasMore, globalPage, loading, hasNext, renderTopPart, page, setPage, predicts, selectedLeague }) => {

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading || page >= globalPage * 5 || predicts.length % 20 != 0) return;

    setPage(page + 1);
  }, [hasMore, loading, page, globalPage, setPage]);

  function onNext() {
    navigation.navigate({
      name: 'Profile', params: {
        globalPage: globalPage + 1,
        selectedStat: selectedStat
      }, key: `profile_page_${globalPage + 1}`
    })
  }

  function onPrev() {
    navigation.goBack()
  }

  const renderFooter = () => {
    // return null
    if (hasNext || globalPage > 1) {

      return <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'blue',
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center'
      }}>
        {globalPage > 1 ? <TouchableOpacity onPress={onPrev} activeOpacity={.6} style={{
          // width: 50,
          flex: 1,
          height: 50,
          alignItems: 'center'
          // backgroundColor: 'red'
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#FF2882'
          }}>{`< ${strings.prev}`}</Text>
        </TouchableOpacity> : null}
        {hasNext ? <TouchableOpacity onPress={onNext} activeOpacity={.6} style={{
          // width: 50,
          flex: 1,
          alignItems: 'center',
          height: 50,
          // backgroundColor: 'red'
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#FF2882'
          }}>{strings.next} ></Text>
        </TouchableOpacity> : null}
      </View>
    }

    if (!hasMore || !loading) return (
      <View style={styles.footer}>
        {/* <ActivityIndicator color={'#FF2882'} size="large" /> */}
      </View>
    );

    return (
      <View style={styles.footer}>
        <ActivityIndicator color={'#FF2882'} size="large" />
      </View>
    );
  };

  function onNavMatch(match) {
    match.leagueName = match.league.name
    match.weekType = match.week_type
    const me = authManager.getMeSync()
    if (!me || (me?.id != user.id)) {
      match.predict = null
    }

    dataManager.setMatch(match)
    navigation.navigate({
      name: 'Match',
      params: {
        id: match.id,
      },
      key: match.id
    })
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  let currMatchDate = null;
  const renderMatch = useCallback(({ item, index }) => {
    let renderTime = false;

    if (currMatchDate == null || !isSameDay(new Date(currMatchDate), new Date(item.date))) {
      renderTime = true;
      currMatchDate = item.date;
    }


    return (
      <View style={{
        width: '90%',
        alignSelf: 'center'
      }}>
        {renderTime || index == 0 ? (
          <View style={styles.dateContainer}>
            { Colors.mode == 1 ? <CalendarIcon width={26} height={26} /> : <CalendarWhiteIcon width={26} height={26} /> }
            <Text style={{
              marginLeft: 10,
              fontWeight: 'bold',
              color: Colors.titleColor,
            }}>{moment(currMatchDate).format('DD')} {strings[moment(currMatchDate).format('MMM').toLowerCase()]} {moment(currMatchDate).format('YYYY')}</Text>
          </View>
        ) : null}
        <MatchItem showLeague={true} onPress={() => onNavMatch(item)} match={item} />
      </View>
    );
  }, []);

  return (
    <FlatList
      contentContainerStyle={{
        // flex: 1,
        width: '100%',
        // alignItems: 'space-betwee'
      }}
      data={predicts}
      style={styles.list}
      keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
      renderItem={renderMatch}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}

      ListFooterComponent={renderFooter}
      ListHeaderComponent={renderTopPart}
      ListFooterComponentStyle={{
        width: '100%',
        // alignItems: 'center',
        // justifyContent: 'center'
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
    // marginTop: 30,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  dateText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  footer: {
    width: '100%',
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
    // paddingVertical: 20,
  },
});

export default UserMatchesList;
