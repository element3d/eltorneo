import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import moment from 'moment';
import CalendarIcon from './assets/calendar_black.svg';
import CalendarWhiteIcon from './assets/calendar_white.svg';
import MatchItem from './MatchItem'; // Ensure you import your component correctly
import strings from './Strings';
import dataManager from './DataManager';
import authManager from './AuthManager';
import Colors from './Colors';


const UserMatchesList = ({ navigation, user, id, hasMore1, globalPage, loading, hasNext1, renderTopPart, page, setPage, predicts, totalPredicts, selectedLeague, onShowMatchPreview, onShowMatchTrailer }) => {
  const numPages = Math.ceil(totalPredicts / 100);
  const hasNext = globalPage < numPages
  const hasMore = (globalPage - 1) * 100 + predicts.length < totalPredicts

  const handleLoadMore = useCallback(() => {
    if (!hasMore || /*loading ||*/ page >= globalPage * 5 || predicts.length % 20 != 0) return;

    setPage(page + 1);
  }, [page/*hasMore, page, globalPage, setPage*/]);

  function onNext() {
    navigation.navigate({
      name: 'Profile', params: {
        globalPage: globalPage + 1,
        id: id,
      }, key: `profile_page_${globalPage + 1}_${id}`
    })
  }

  function onPrev() {
    navigation.goBack()
  }

  function showNextPrev() {

    if (loading) return false
    // if (hasMore && ((globalPage - 1) * 100 + predicts.length < totalPredicts )) return true
    if (!hasMore && globalPage > 1 && ((globalPage - 1) * 100 + predicts.length >= totalPredicts)) return true
    if (hasMore && predicts.length >= 100) return true

    return false
  }

  const renderFooter = () => {
    // return null
    // if ((hasNext || globalPage > 1) && !loading) {
    const showNP = showNextPrev()
    if (showNP) {
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
          }}>{`${strings.next} >`}</Text>
        </TouchableOpacity> : null}
      </View>
    }


    if (!loading) return (
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

  const renderItem = useCallback(({ item, index }) => {
    return (
      <View style={{
        width: '90%',
        alignSelf: 'center'
      }}>
        <MatchItem showLeague={true} onPress={() => onNavMatch(item)} match={item} onShowMatchPreview={onShowMatchPreview} onShowMatchTrailer={onShowMatchTrailer} />
      </View>
    );
  }, [onNavMatch, onShowMatchPreview]);

  let currMatchDate = null;

  const renderMatch = ({ item, index }) => {
    // let renderTime = false;

    // if (currMatchDate == null || !isSameDay(new Date(currMatchDate), new Date(item.date))) {
    //   renderTime = true;
    //   currMatchDate = item.date;
    // }


    return (
      <View style={{
        width: '90%',
        // height: 130,
        alignSelf: 'center'
      }}>
        {/* {renderTime || index == 0 ? (
          <View style={styles.dateContainer}>
            { Colors.mode == 1 ? <CalendarIcon width={26} height={26} /> : <CalendarWhiteIcon width={26} height={26} /> }
            <Text style={{
              marginLeft: 10,
              fontWeight: 'bold',
              color: Colors.titleColor,
            }}>{moment(currMatchDate).format('DD')} {strings[moment(currMatchDate).format('MMM').toLowerCase()]} {moment(currMatchDate).format('YYYY')}</Text>
          </View>
        ) : null} */}
        <MatchItem showLeague={true} onPress={() => onNavMatch(item)} match={item} onShowMatchPreview={onShowMatchPreview} onShowMatchTrailer={onShowMatchTrailer} showDate/>
      </View>
    );

  }

  const renderMatch1 = useCallback(({ item, index }) => {
    return <MatchItem showLeague={true} onPress={() => onNavMatch(item)} match={item} onShowMatchPreview={onShowMatchPreview} />

    let renderTime = false;

    if (currMatchDate == null || !isSameDay(new Date(currMatchDate), new Date(item.date))) {
      renderTime = true;
      currMatchDate = item.date;
    }


    return (
      <View style={{
        width: '90%',
        height: 100,
        alignSelf: 'center'
      }}>
        {/* {renderTime || index == 0 ? (
          <View style={styles.dateContainer}>
            { Colors.mode == 1 ? <CalendarIcon width={26} height={26} /> : <CalendarWhiteIcon width={26} height={26} /> }
            <Text style={{
              marginLeft: 10,
              fontWeight: 'bold',
              color: Colors.titleColor,
            }}>{moment(currMatchDate).format('DD')} {strings[moment(currMatchDate).format('MMM').toLowerCase()]} {moment(currMatchDate).format('YYYY')}</Text>
          </View>
        ) : null} */}
        <MatchItem showLeague={true} onPress={() => onNavMatch(item)} match={item} onShowMatchPreview={onShowMatchPreview} />
      </View>
    );
  }, []);

  return (
    <FlatList
      contentContainerStyle={{
        width: '100%',
      }}
      data={predicts}
      style={styles.list}
      keyExtractor={(item) => item.id.toString()} // Use item.id alone
      renderItem={renderMatch}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}

      ListFooterComponent={renderFooter}
      ListHeaderComponent={renderTopPart}
      ListFooterComponentStyle={{
        width: '100%',
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
